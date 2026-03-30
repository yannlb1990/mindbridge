import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Vercel Cron: runs every hour
// Configure in vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 * * * *" }] }

function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Supabase admin credentials not configured');
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

function formatAEDT(isoString: string): string {
  return new Date(isoString).toLocaleString('en-AU', {
    timeZone: 'Australia/Sydney',
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

export async function GET(req: NextRequest) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return NextResponse.json({ error: 'Resend not configured' }, { status: 503 });
  }

  const resend = new Resend(resendKey);
  const supabase = getAdminClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';

  const now = new Date();
  const sent: string[] = [];
  const errors: string[] = [];

  try {
    // Find sessions in the next 49 hours (48h window + 1h buffer) that haven't had a reminder sent
    const windowEnd = new Date(now.getTime() + 49 * 60 * 60 * 1000);

    const { data: upcomingSessions, error: sessionsError } = await supabase
      .from('sessions')
      .select(`
        id, scheduled_start, session_type, telehealth_link, duration_minutes, fee,
        reminder_24h_sent, reminder_48h_sent,
        client:users!sessions_client_id_fkey (id, email, first_name, last_name, phone),
        clinician:users!sessions_clinician_id_fkey (first_name, last_name, email)
      `)
      .eq('status', 'scheduled')
      .gte('scheduled_start', now.toISOString())
      .lte('scheduled_start', windowEnd.toISOString());

    if (sessionsError) throw sessionsError;

    for (const session of upcomingSessions || []) {
      const sessionStart = new Date(session.scheduled_start);
      const hoursUntil = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);
      const client = Array.isArray(session.client) ? session.client[0] : (session.client as any);
      const clinician = Array.isArray(session.clinician) ? session.clinician[0] : (session.clinician as any);
      const clientEmail = client?.email;
      const clientName = `${client?.first_name || ''} ${client?.last_name || ''}`.trim();
      const clinicianName = `${clinician?.first_name || ''} ${clinician?.last_name || ''}`.trim();
      const formattedTime = formatAEDT(session.scheduled_start);
      const isTelehealth = session.session_type === 'telehealth' || session.session_type === 'phone';

      if (!clientEmail) continue;

      // Send 48h reminder
      if (hoursUntil <= 48 && hoursUntil > 23 && !session.reminder_48h_sent) {
        try {
          await resend.emails.send({
            from: 'MindBridge <reminders@mindbridge.com.au>',
            to: clientEmail,
            subject: `Reminder: Your session is in 2 days`,
            html: buildReminderEmail({
              clientName,
              clinicianName,
              formattedTime,
              isTelehealth,
              telehealthLink: session.telehealth_link,
              appUrl,
              hoursLabel: '2 days',
            }),
          });

          await supabase
            .from('sessions')
            .update({ reminder_48h_sent: true })
            .eq('id', session.id);

          sent.push(`48h: ${session.id}`);
        } catch (e: any) {
          errors.push(`48h ${session.id}: ${e.message}`);
        }
      }

      // Send 24h reminder
      if (hoursUntil <= 24 && hoursUntil > 1 && !session.reminder_24h_sent) {
        try {
          await resend.emails.send({
            from: 'MindBridge <reminders@mindbridge.com.au>',
            to: clientEmail,
            subject: `Reminder: Your session is tomorrow`,
            html: buildReminderEmail({
              clientName,
              clinicianName,
              formattedTime,
              isTelehealth,
              telehealthLink: session.telehealth_link,
              appUrl,
              hoursLabel: 'tomorrow',
            }),
          });

          await supabase
            .from('sessions')
            .update({ reminder_24h_sent: true })
            .eq('id', session.id);

          sent.push(`24h: ${session.id}`);
        } catch (e: any) {
          errors.push(`24h ${session.id}: ${e.message}`);
        }
      }
    }

    return NextResponse.json({ ok: true, sent, errors, timestamp: now.toISOString() });
  } catch (err: any) {
    console.error('Reminder cron error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

interface ReminderEmailOptions {
  clientName: string;
  clinicianName: string;
  formattedTime: string;
  isTelehealth: boolean;
  telehealthLink?: string;
  appUrl: string;
  hoursLabel: string;
}

function buildReminderEmail(opts: ReminderEmailOptions): string {
  const { clientName, clinicianName, formattedTime, isTelehealth, telehealthLink, appUrl, hoursLabel } = opts;
  return `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
  <div style="background: #f7f5f0; border-radius: 12px; padding: 32px;">
    <h2 style="margin: 0 0 8px; color: #2d5a27; font-size: 22px;">Session Reminder</h2>
    <p style="margin: 0 0 24px; color: #666;">Hi ${clientName},</p>
    <p style="margin: 0 0 24px;">This is a reminder that your session with <strong>${clinicianName}</strong> is <strong>${hoursLabel}</strong>.</p>
    <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 24px; border-left: 4px solid #7c9885;">
      <p style="margin: 0 0 8px;"><strong>Date & Time:</strong> ${formattedTime}</p>
      <p style="margin: 0;"><strong>Type:</strong> ${isTelehealth ? 'Telehealth (Video/Phone)' : 'In-Person'}</p>
    </div>
    ${isTelehealth && telehealthLink ? `
    <div style="text-align: center; margin-bottom: 24px;">
      <a href="${telehealthLink}" style="background: #7c9885; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: 600; display: inline-block;">Join Telehealth Session</a>
    </div>
    ` : ''}
    <p style="margin: 0 0 16px; font-size: 14px; color: #666;">If you need to cancel or reschedule, please let your clinician know as soon as possible.</p>
    <a href="${appUrl}/client/login" style="color: #7c9885; font-size: 14px;">Log in to MindBridge</a>
  </div>
</body>
</html>`;
}
