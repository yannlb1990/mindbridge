import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const FROM_EMAIL = process.env.FROM_EMAIL || 'notifications@mindbridge.com.au';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

// Calculate age from date of birth string (YYYY-MM-DD)
function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { conversation_id, sender_id, sender_type, content, client_id, clinician_id } = body;

    if (!content?.trim() || !sender_id || !sender_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Upsert conversation if new
    let convId = conversation_id;
    if (!convId && client_id && clinician_id) {
      const { data: conv, error: convError } = await supabase
        .from('conversations')
        .upsert(
          { clinician_id, client_id },
          { onConflict: 'clinician_id,client_id', ignoreDuplicates: false }
        )
        .select('id')
        .single();

      if (convError) throw convError;
      convId = conv.id;
    }

    if (!convId) {
      return NextResponse.json({ error: 'Missing conversation_id or client/clinician ids' }, { status: 400 });
    }

    // Insert the message
    const { data: message, error: msgError } = await supabase
      .from('messages')
      .insert({
        conversation_id: convId,
        sender_id,
        sender_type,
        content: content.trim(),
      })
      .select()
      .single();

    if (msgError) throw msgError;

    // --- Email notification logic ---
    if (resend) {
      if (sender_type === 'clinician') {
        // Clinician sent a message → notify client IF they are 18+
        await notifyClient(convId, content);
      } else if (sender_type === 'client') {
        // Client sent a message → always notify clinician
        await notifyClinicianOfClientMessage(convId, content);
      }
    }

    return NextResponse.json({ success: true, message });
  } catch (err: any) {
    console.error('Messages send error:', err);
    return NextResponse.json({ error: err.message || 'Internal server error' }, { status: 500 });
  }
}

async function notifyClient(conversationId: string, messageContent: string) {
  // Get conversation + client profile (need date_of_birth for age check)
  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      client_id,
      clinician:users!conversations_clinician_id_fkey (first_name, last_name),
      client_profile:client_profiles!inner (date_of_birth, email:users(email))
    `)
    .eq('id', conversationId)
    .single();

  if (!conv) return;

  // Get client user email and DOB
  const { data: clientProfile } = await supabase
    .from('client_profiles')
    .select('date_of_birth')
    .eq('user_id', conv.client_id)
    .single();

  const { data: clientUser } = await supabase
    .from('users')
    .select('email, first_name')
    .eq('id', conv.client_id)
    .single();

  if (!clientUser?.email || !clientProfile?.date_of_birth) return;

  const age = calculateAge(clientProfile.date_of_birth);

  // Only send email notification for clients 18 and over
  if (age < 18) return;

  const clinicianName = (conv.clinician as any)
    ? `Dr. ${(conv.clinician as any).last_name}`
    : 'Your clinician';

  await resend!.emails.send({
    from: FROM_EMAIL,
    to: clientUser.email,
    subject: `New message from ${clinicianName} — MindBridge`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #f9f7f4; padding: 32px;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
          <div style="margin-bottom: 24px;">
            <img src="${APP_URL}/favicon.ico" width="32" height="32" alt="MindBridge" style="border-radius: 8px;" />
          </div>
          <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">You have a new message</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
            ${clinicianName} sent you a message on MindBridge.
          </p>
          <div style="background: #f0f5f0; border-left: 3px solid #6b9e6b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">
              "${messageContent.length > 200 ? messageContent.slice(0, 200) + '…' : messageContent}"
            </p>
          </div>
          <a href="${APP_URL}/client/messages"
             style="display: inline-block; background: #6b9e6b; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Reply in MindBridge
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; line-height: 1.5;">
            This is a secure notification from MindBridge. Please do not reply to this email.<br/>
            Messages are encrypted and comply with Australian Privacy Principles.
          </p>
        </div>
      </div>
    `,
  });
}

async function notifyClinicianOfClientMessage(conversationId: string, messageContent: string) {
  const { data: conv } = await supabase
    .from('conversations')
    .select(`
      clinician_id,
      client:users!conversations_client_id_fkey (first_name, last_name),
      clinician:users!conversations_clinician_id_fkey (email, first_name, last_name)
    `)
    .eq('id', conversationId)
    .single();

  if (!conv) return;

  const clinicianEmail = (conv.clinician as any)?.email;
  const clientName = (conv.client as any)
    ? `${(conv.client as any).first_name} ${(conv.client as any).last_name}`
    : 'Your client';

  if (!clinicianEmail) return;

  await resend!.emails.send({
    from: FROM_EMAIL,
    to: clinicianEmail,
    subject: `New message from ${clientName} — MindBridge`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; background: #f9f7f4; padding: 32px;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 1px 4px rgba(0,0,0,0.06);">
          <div style="margin-bottom: 24px;">
            <img src="${APP_URL}/favicon.ico" width="32" height="32" alt="MindBridge" style="border-radius: 8px;" />
          </div>
          <h2 style="color: #1a1a1a; font-size: 20px; margin: 0 0 8px;">New client message</h2>
          <p style="color: #6b7280; font-size: 14px; margin: 0 0 24px;">
            ${clientName} sent you a message on MindBridge.
          </p>
          <div style="background: #f0f5f0; border-left: 3px solid #6b9e6b; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="color: #374151; font-size: 14px; margin: 0; line-height: 1.6;">
              "${messageContent.length > 200 ? messageContent.slice(0, 200) + '…' : messageContent}"
            </p>
          </div>
          <a href="${APP_URL}/messages"
             style="display: inline-block; background: #6b9e6b; color: white; padding: 12px 24px; border-radius: 10px; text-decoration: none; font-size: 14px; font-weight: 600;">
            Reply in MindBridge
          </a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 24px; line-height: 1.5;">
            This is a secure notification from MindBridge. Please do not reply to this email.<br/>
            Messages are encrypted and comply with Australian Privacy Principles.
          </p>
        </div>
      </div>
    `,
  });
}
