import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Minus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MindBridge vs Cliniko — Practice Management for Psychologists',
  description:
    'Compare MindBridge and Cliniko for Australian psychology practices. MindBridge adds AI clinical note generation, MHTP/Better Access tracking, and an age-adaptive client portal that Cliniko lacks.',
  alternates: { canonical: 'https://mindbridge.com.au/compare/cliniko' },
  openGraph: {
    title: 'MindBridge vs Cliniko — Which is Better for Australian Psychologists?',
    description:
      'Side-by-side comparison of MindBridge and Cliniko. See which practice management platform has built-in AI notes, MHTP tracking, and a client-facing portal.',
    url: 'https://mindbridge.com.au/compare/cliniko',
    type: 'website',
  },
};

const features = [
  { feature: 'AI clinical note generation (SOAP/DAP/BIRP)', mindbridge: true, cliniko: false },
  { feature: 'MHTP / Better Access session tracking', mindbridge: true, cliniko: false },
  { feature: 'Client-facing portal', mindbridge: true, cliniko: 'partial' },
  { feature: 'Age-adaptive portal (child, teen, adult)', mindbridge: true, cliniko: false },
  { feature: 'Appointment scheduling & reminders', mindbridge: true, cliniko: true },
  { feature: 'Medicare billing & item numbers', mindbridge: true, cliniko: true },
  { feature: 'Telehealth integration', mindbridge: true, cliniko: true },
  { feature: 'Standardised measures (PHQ-9, GAD-7, K10, DASS-21)', mindbridge: true, cliniko: false },
  { feature: 'Safety plan management', mindbridge: true, cliniko: false },
  { feature: 'Secure clinician–client messaging', mindbridge: true, cliniko: false },
  { feature: 'Homework assignment & tracking', mindbridge: true, cliniko: false },
  { feature: 'AHPRA-compliant, Australia-hosted data', mindbridge: true, cliniko: true },
  { feature: 'Mood & journal tracking for clients', mindbridge: true, cliniko: false },
  { feature: 'Free tier available', mindbridge: true, cliniko: false },
];

function Cell({ value }: { value: boolean | 'partial' }) {
  if (value === true) return <Check className="w-5 h-5 text-sage mx-auto" />;
  if (value === 'partial') return <Minus className="w-5 h-5 text-gold mx-auto" />;
  return <X className="w-5 h-5 text-text-muted mx-auto" />;
}

export default function CompareClinikoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'MindBridge vs Cliniko',
            description:
              'Feature comparison of MindBridge and Cliniko practice management software for Australian psychologists.',
            url: 'https://mindbridge.com.au/compare/cliniko',
            breadcrumb: {
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mindbridge.com.au' },
                { '@type': 'ListItem', position: 2, name: 'Compare', item: 'https://mindbridge.com.au/compare' },
                { '@type': 'ListItem', position: 3, name: 'MindBridge vs Cliniko' },
              ],
            },
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
            MindBridge vs Cliniko
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Cliniko is a solid scheduling and billing platform. MindBridge goes further — with built-in AI note
            generation, MHTP tracking, and a therapeutic client portal designed specifically for mental health practices.
          </p>
        </div>

        {/* Highlight cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            {
              icon: '🤖',
              title: 'AI Notes in seconds',
              desc: 'Generate SOAP, DAP, BIRP, or Narrative notes from recorded sessions. Cliniko requires you to type every word.',
            },
            {
              icon: '📋',
              title: 'MHTP tracking built-in',
              desc: 'Track Better Access sessions, GP referral numbers, and expiry dates automatically. A critical gap in Cliniko.',
            },
            {
              icon: '👨‍👩‍👧',
              title: 'Age-adaptive portal',
              desc: "Clients log mood, complete homework, and message securely. Children see a different UI to adults. Cliniko's patient portal is appointment-only.",
            },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{c.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        {/* Comparison table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-14">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand">
                <th className="text-left px-6 py-4 font-semibold text-text-primary w-1/2">Feature</th>
                <th className="px-6 py-4 font-semibold text-sage">MindBridge</th>
                <th className="px-6 py-4 font-semibold text-text-secondary">Cliniko</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-cream'}>
                  <td className="px-6 py-3 text-text-secondary">{row.feature}</td>
                  <td className="px-6 py-3 text-center"><Cell value={row.mindbridge} /></td>
                  <td className="px-6 py-3 text-center"><Cell value={row.cliniko as boolean | 'partial'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-6 py-3 bg-sand text-xs text-text-muted flex gap-6">
            <span className="flex items-center gap-1"><Check className="w-3.5 h-3.5 text-sage" /> Included</span>
            <span className="flex items-center gap-1"><Minus className="w-3.5 h-3.5 text-gold" /> Partial</span>
            <span className="flex items-center gap-1"><X className="w-3.5 h-3.5 text-text-muted" /> Not available</span>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Try MindBridge free today</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            No credit card required. Set up your practice in minutes and see the difference AI-powered tools make.
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
