import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Changelog — MindBridge Product Updates',
  description:
    'What\'s new in MindBridge. Follow product updates, new features, and improvements for Australian psychology practice management.',
  alternates: { canonical: 'https://mindbridge.com.au/changelog' },
};

const updates = [
  {
    version: '1.4',
    date: 'March 2026',
    tag: 'Major',
    tagColor: 'bg-sage text-white',
    items: [
      { type: 'New', text: 'AI session sentiment analysis — Claude analyses session notes and generates emotional timeline with turning points' },
      { type: 'New', text: 'Smart session preparation — AI generates agenda suggestions and resource briefs before each session' },
      { type: 'New', text: 'Outcome tracking dashboard — PHQ-9, GAD-7, K10, and DASS-21 trends with clinically significant change detection' },
      { type: 'New', text: 'Appointment reminder emails — automatic 24h and 48h reminders sent to clients via Resend' },
      { type: 'Improved', text: 'MHTP Better Access tracking — session counter, referral expiry alerts, and GP referral number storage' },
      { type: 'Improved', text: 'Dashboard alerts now surface MHTP expirations and sessions running low' },
    ],
  },
  {
    version: '1.3',
    date: 'February 2026',
    tag: 'Feature',
    tagColor: 'bg-calm text-white',
    items: [
      { type: 'New', text: 'Real AI session capture — MediaRecorder + Whisper transcription + Claude note generation (SOAP/DAP/BIRP/Narrative)' },
      { type: 'New', text: 'Age-adaptive client portal — children, teens, and adults see different interfaces' },
      { type: 'New', text: 'Safety plan management — clinician builds plan, client accesses it 24/7 from portal' },
      { type: 'Improved', text: 'Client portal mood tracking, journaling, and homework wired to real Supabase data' },
      { type: 'Fixed', text: 'Client creation now correctly creates auth.users row before public.users (FK constraint fix)' },
    ],
  },
  {
    version: '1.2',
    date: 'January 2026',
    tag: 'Feature',
    tagColor: 'bg-calm text-white',
    items: [
      { type: 'New', text: 'Emotion Coach AI — age-appropriate therapeutic conversations powered by Claude' },
      { type: 'New', text: 'Standardised outcome measures — PHQ-9, GAD-7, K10, DASS-21 delivery to clients' },
      { type: 'Improved', text: 'All clinical hooks (useNotes, useHomework, useSessions) wired to real Supabase data' },
      { type: 'Improved', text: 'Settings page now persists practice details to clinician_profiles table' },
      { type: 'Fixed', text: 'Note signing now persists is_signed and signed_at to database' },
    ],
  },
  {
    version: '1.1',
    date: 'December 2025',
    tag: 'Foundation',
    tagColor: 'bg-gold/60 text-text-primary',
    items: [
      { type: 'New', text: 'Initial Supabase integration — authentication, client profiles, sessions, clinical notes' },
      { type: 'New', text: 'Demo mode — full platform walkthrough without account creation' },
      { type: 'New', text: 'ThemeProvider — light/dark mode and accent colour customisation' },
      { type: 'New', text: 'Session scheduling with telehealth link support' },
    ],
  },
];

const typeColor: Record<string, string> = {
  New: 'text-sage bg-sage/10',
  Improved: 'text-calm bg-calm/10',
  Fixed: 'text-amber-700 bg-amber-50',
};

export default function ChangelogPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Changelog</p>
        <h1 className="text-4xl font-display font-bold text-text-primary mb-4">What&apos;s new in MindBridge</h1>
        <p className="text-text-secondary">Product updates and improvements — most recent first.</p>
      </div>

      <div className="space-y-10">
        {updates.map((update) => (
          <div key={update.version} className="bg-white rounded-2xl shadow-soft p-8">
            <div className="flex items-center gap-3 mb-5">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${update.tagColor}`}>
                {update.tag}
              </span>
              <h2 className="text-lg font-display font-bold text-text-primary">
                Version {update.version}
              </h2>
              <span className="text-sm text-text-muted ml-auto">{update.date}</span>
            </div>
            <ul className="space-y-3">
              {update.items.map((item, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded shrink-0 mt-0.5 ${typeColor[item.type] || 'text-text-muted bg-sand'}`}>
                    {item.type}
                  </span>
                  <span className="text-text-secondary leading-relaxed">{item.text}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
