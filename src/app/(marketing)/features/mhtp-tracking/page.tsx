import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'MHTP Better Access Session Tracking — MindBridge for Australian Psychologists',
  description:
    'Track Mental Health Treatment Plan (MHTP) sessions automatically. MindBridge counts Better Access sessions, stores GP referral numbers, and alerts you before sessions expire — built for Australian psychologists.',
  alternates: { canonical: 'https://mindbridge.com.au/features/mhtp-tracking' },
  openGraph: {
    title: 'MHTP Better Access Tracking for Australian Psychologists — MindBridge',
    description:
      'Never lose track of a client\'s Better Access sessions again. MindBridge tracks MHTP session counts, GP referral expiry, and Medicare item numbers automatically.',
    url: 'https://mindbridge.com.au/features/mhtp-tracking',
    type: 'website',
  },
};

export default function MhtpTrackingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'MHTP Better Access Session Tracking — MindBridge',
            description:
              'MindBridge tracks MHTP Better Access sessions, GP referral numbers, and Medicare billing for Australian psychologists.',
            url: 'https://mindbridge.com.au/features/mhtp-tracking',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Feature</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            MHTP & Better Access<br />tracking — automated
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Never manually count sessions or chase GP referral paperwork again. MindBridge tracks every Better Access
            session, alerts you before a referral expires, and keeps Medicare item numbers organised.
          </p>
          <Link href="/auth/signup" className="btn-primary px-8 py-3 rounded-xl font-semibold">
            Start free — no card needed
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* What is MHTP */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">What is the Better Access initiative?</h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            The Better Access initiative (Medicare item numbers 80000–80025) allows eligible Australians to access
            up to 20 individual psychological therapy sessions per calendar year when referred under a Mental Health
            Treatment Plan (MHTP) by their GP or psychiatrist.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            Psychologists must track session counts precisely. Exceeding the cap, missing a referral review date, or
            billing the wrong item number can result in Medicare audits. MindBridge automates this compliance burden.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid sm:grid-cols-2 gap-6 mb-14">
          {[
            {
              icon: '📊',
              title: 'Session counter per client',
              body: 'Each client profile shows sessions used vs total MHTP allocation. The dashboard alerts you when a client has 2 or fewer sessions remaining.',
            },
            {
              icon: '📅',
              title: 'Referral expiry alerts',
              body: 'Store the referral date and MindBridge calculates expiry. You get an alert 30 days before expiry so you can request a renewal without disrupting care.',
            },
            {
              icon: '🏥',
              title: 'GP referral details',
              body: 'Store the referring GP name, referral number, and review date against each client profile — accessible in one click during a session.',
            },
            {
              icon: '🧾',
              title: 'Medicare item numbers',
              body: 'Log the correct Medicare item number when scheduling sessions. MindBridge helps you track 80000-series items and client eligibility.',
            },
            {
              icon: '🔔',
              title: 'Dashboard alerts',
              body: 'Your dashboard surfaces critical MHTP warnings at a glance — expiring referrals, sessions almost exhausted, and review dates upcoming.',
            },
            {
              icon: '📋',
              title: 'Billing type tracking',
              body: 'Mark clients as Medicare, private, NDIS, or WorkCover. Billing type is visible at the session level so invoicing is always accurate.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Compliance note */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 mb-14 flex gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-semibold text-text-primary text-sm mb-1">Medicare compliance is your responsibility</p>
            <p className="text-sm text-text-secondary">
              MindBridge helps you track and organise MHTP information but does not submit claims to Medicare directly.
              Always verify item numbers and session counts with your billing software or practice administrator.
              MindBridge data can be exported for your Medicare billing workflow.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-3 gap-6 mb-14 text-center">
          {[
            { stat: '20', label: 'Max individual sessions per calendar year under Better Access' },
            { stat: '0 min', label: 'Manual counting — MindBridge tracks sessions automatically' },
            { stat: '30 days', label: 'Advance warning before GP referral expires' },
          ].map((s) => (
            <div key={s.stat} className="bg-sand rounded-xl p-6">
              <p className="text-3xl font-bold text-sage mb-1">{s.stat}</p>
              <p className="text-sm text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Compare */}
        <div className="text-center text-sm text-text-muted mb-16">
          MHTP tracking not available in →{' '}
          <Link href="/compare/cliniko" className="text-sage hover:underline">Cliniko</Link> or{' '}
          <Link href="/compare/simplepractice" className="text-sage hover:underline">SimplePractice</Link>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Stop counting sessions on a spreadsheet</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            MindBridge tracks every Better Access session automatically. Free to start.
          </p>
          <Link
            href="/auth/signup"
            className="inline-block bg-white text-sage font-semibold px-8 py-3 rounded-xl hover:bg-cream transition-colors"
          >
            Start free trial
          </Link>
        </div>
      </div>
    </>
  );
}
