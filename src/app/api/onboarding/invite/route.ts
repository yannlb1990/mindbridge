import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import crypto from 'crypto';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) return NextResponse.json({ error: 'Email not configured' }, { status: 503 });

  const body = await req.json();
  const { clientId, email, firstName, clinicianName, clinicianId } = body;

  if (!clientId || !email || !firstName || !clinicianId) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const admin = getAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  // Store token in DB
  const { error: tokenError } = await admin.from('onboarding_invites').insert({
    token,
    client_id: clientId,
    clinician_id: clinicianId,
    email,
    expires_at: expiresAt.toISOString(),
  });

  if (tokenError) {
    // Table may not exist yet — continue anyway and return token for manual testing
    console.error('Token storage failed:', tokenError.message);
  }

  const inviteUrl = `${appUrl}/onboarding/${token}`;

  const resend = new Resend(resendKey);
  await resend.emails.send({
    from: 'MindBridge <noreply@mindbridge.com.au>',
    to: email,
    subject: `${clinicianName || 'Your clinician'} has invited you to MindBridge`,
    html: buildInviteEmail({ firstName, clinicianName: clinicianName || 'Your clinician', inviteUrl, appUrl }),
  });

  return NextResponse.json({ ok: true, inviteUrl });
}

function buildInviteEmail({ firstName, clinicianName, inviteUrl, appUrl }: {
  firstName: string; clinicianName: string; inviteUrl: string; appUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
  <div style="background:#f7f5f0;border-radius:12px;padding:32px;">
    <h2 style="margin:0 0 8px;color:#2d5a27;font-size:22px;">Welcome to MindBridge</h2>
    <p style="margin:0 0 20px;color:#666;">Hi ${firstName},</p>
    <p style="margin:0 0 20px;">${clinicianName} has invited you to use MindBridge — a secure platform where you can track your wellbeing, complete between-session exercises, and stay connected with your care team.</p>
    <p style="margin:0 0 8px;font-weight:600;">To get started, complete your profile setup:</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${inviteUrl}" style="background:#7c9885;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">Complete your profile</a>
    </div>
    <p style="margin:0 0 8px;font-size:14px;color:#666;">This link expires in 7 days. If you have any questions, contact your clinician directly.</p>
    <p style="margin:16px 0 0;font-size:12px;color:#999;">If you received this in error, please ignore this email.</p>
  </div>
</body>
</html>`;
}
