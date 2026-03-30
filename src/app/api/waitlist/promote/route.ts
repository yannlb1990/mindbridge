import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export async function POST(req: NextRequest) {
  const { clientId, email, firstName } = await req.json();
  if (!clientId) return NextResponse.json({ error: 'clientId required' }, { status: 400 });

  const admin = getAdminClient();

  // Update client_profiles status to active
  const { error } = await admin
    .from('client_profiles')
    .update({ status: 'active' })
    .eq('id', clientId);

  if (error) {
    console.error('Waitlist promote error:', error.message);
    return NextResponse.json({ error: 'Failed to update client status' }, { status: 500 });
  }

  // Send notification email if Resend is configured
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && email) {
    const resend = new Resend(resendKey);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';
    await resend.emails.send({
      from: 'MindBridge <noreply@mindbridge.com.au>',
      to: email,
      subject: 'Good news — you\'ve been moved off the waitlist',
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;padding:24px;color:#1a1a1a;">
  <div style="background:#f7f5f0;border-radius:12px;padding:32px;">
    <h2 style="margin:0 0 8px;color:#2d5a27;font-size:22px;">You&rsquo;re off the waitlist!</h2>
    <p style="margin:0 0 20px;color:#666;">Hi ${firstName || 'there'},</p>
    <p style="margin:0 0 20px;">Great news — your clinician has a spot available and has activated your account. You can now log in to your MindBridge client portal to book your first session and get started.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${appUrl}/client/login" style="background:#7c9885;color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">Log in to MindBridge</a>
    </div>
    <p style="margin:0;font-size:13px;color:#999;">If you have any questions, please contact your clinician directly.</p>
  </div>
</body>
</html>`,
    }).catch((e) => console.error('Waitlist email error:', e));
  }

  return NextResponse.json({ ok: true });
}
