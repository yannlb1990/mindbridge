import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Minus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MindBridge vs Halaxy — Practice Management Software Australia',
  description:
    'MindBridge vs Halaxy: detailed feature comparison for Australian psychology and counselling practices. Discover why MindBridge is the better choice for AI notes, MHTP tracking, and client engagement.',
  alternates: { canonical: 'https://mindbridge.com.au/compare/halaxy' },
  openGraph: {
    title: 'MindBridge vs Halaxy — AI Notes, MHTP Tracking & More',
    description:
      'Compare MindBridge and Halaxy side by side. MindBridge adds AI clinical note generation, MHTP Better Access tracking, and outcome measures that Halaxy does not offer.',
    url: 'https://mindbridge.com.au/compare/halaxy',
    type: 'website',
  },
};

const features = [
  { feature: 'AI clinical note generation (SOAP/DAP/BIRP)', mindbridge: true, halaxy: false },
  { feature: 'MHTP / Better Access session tracking', mindbridge: true, halaxy: 'partial' },
  { feature: 'Client-facing portal', mindbridge: true, halaxy: true },
  { feature: 'Age-adaptive portal (child, teen, adult)', mindbridge: true, halaxy: false },
  { feature: 'Appointment scheduling & reminders', mindbridge: true, halaxy: true },
  { feature: 'Medicare billing & item numbers', mindbridge: true, halaxy: true },
  { feature: 'Telehealth integration', mindbridge: true, halaxy: true },
  { feature: 'Standardised measures (PHQ-9, GAD-7, K10, DASS-21)', mindbridge: true, halaxy: false },
  { feature: 'Safety plan management', mindbridge: true, halaxy: false },
  { feature: 'Secure clinician–client messaging', mindbridge: true, halaxy: false },
  { feature: 'Homework assignment & tracking', mindbridge: true, halaxy: false },
  { feature: 'AHPRA-compliant, Australia-hosted data', mindbridge: true, halaxy: true },
  { feature: 'Mood & journal tracking for clients', mindbridge: true, halaxy: false },
  { feature: 'Free tier available', mindbridge: true, halaxy: true },
];

function Cell({ value }: { value: boolean | 'partial' }) {
  if (value === true) return <Check className="w-5 h-5 text-sage mx-auto" />;
  if (value === 'partial') return <Minus className="w-5 h-5 text-gold mx-auto" />;
  return <X className="w-5 h-5 text-text-muted mx-auto" />;
}

export default function CompareHalaxyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'MindBridge vs Halaxy',
            description:
              'Feature comparison of MindBridge and Halaxy practice management software for Australian clinicians.',
            url: 'https://mindbridge.com.au/compare/halaxy',
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
            MindBridge vs Halaxy
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Halaxy handles billing and appointments well. But when it comes to clinical intelligence — AI note
            generation, standardised outcome measures, and a therapeutic client portal — MindBridge is purpose-built
            for mental health.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            {
              icon: '✍️',
              title: 'Notes in one click',
              desc: 'Record your session, choose SOAP or DAP format, and get a complete clinical note in seconds. Halaxy requires manual entry.',
            },
            {
              icon: '📊',
              title: 'Outcome measures built-in',
              desc: 'Administer PHQ-9, GAD-7, K10, and DASS-21 directly in the platform and track progress over time. Not available in Halaxy.',
            },
            {
              icon: '🔒',
              title: 'Therapeutic client portal',
              desc: "Clients complete homework, log mood, write in their journal, and message you securely — all from one place. Halaxy's portal is limited to appointments and invoices.",
            },
          ].map((c) => (
            <div key={c.title} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-3xl mb-3">{c.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{c.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-soft overflow-hidden mb-14">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sand">
                <th className="text-left px-6 py-4 font-semibold text-text-primary w-1/2">Feature</th>
                <th className="px-6 py-4 font-semibold text-sage">MindBridge</th>
                <th className="px-6 py-4 font-semibold text-text-secondary">Halaxy</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-cream'}>
                  <td className="px-6 py-3 text-text-secondary">{row.feature}</td>
                  <td className="px-6 py-3 text-center"><Cell value={row.mindbridge} /></td>
                  <td className="px-6 py-3 text-center"><Cell value={row.halaxy as boolean | 'partial'} /></td>
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

        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Switch to MindBridge — it&apos;s free to start</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Import your clients and get set up in minutes. No lock-in contracts, no credit card required.
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
