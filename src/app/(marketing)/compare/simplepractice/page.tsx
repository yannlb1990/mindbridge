import type { Metadata } from 'next';
import Link from 'next/link';
import { Check, X, Minus } from 'lucide-react';

export const metadata: Metadata = {
  title: 'MindBridge vs SimplePractice — Australian Alternative for Psychologists',
  description:
    'Looking for a SimplePractice alternative in Australia? MindBridge is built for Australian clinicians with Medicare billing, Better Access MHTP tracking, and AI note generation — all AHPRA-compliant.',
  alternates: { canonical: 'https://mindbridge.com.au/compare/simplepractice' },
  openGraph: {
    title: 'MindBridge vs SimplePractice — The Australian Alternative',
    description:
      'SimplePractice is US-focused. MindBridge is built for Australian psychologists with Medicare, MHTP tracking, and AHPRA-compliant data hosting.',
    url: 'https://mindbridge.com.au/compare/simplepractice',
    type: 'website',
  },
};

const features = [
  { feature: 'AI clinical note generation (SOAP/DAP/BIRP)', mindbridge: true, sp: 'partial' },
  { feature: 'MHTP / Better Access session tracking', mindbridge: true, sp: false },
  { feature: 'Medicare billing (Australia)', mindbridge: true, sp: false },
  { feature: 'Client-facing portal', mindbridge: true, sp: true },
  { feature: 'Age-adaptive portal (child, teen, adult)', mindbridge: true, sp: false },
  { feature: 'Appointment scheduling & reminders', mindbridge: true, sp: true },
  { feature: 'Telehealth integration', mindbridge: true, sp: true },
  { feature: 'Standardised measures (PHQ-9, GAD-7, K10, DASS-21)', mindbridge: true, sp: 'partial' },
  { feature: 'Safety plan management', mindbridge: true, sp: false },
  { feature: 'Secure clinician–client messaging', mindbridge: true, sp: true },
  { feature: 'Homework assignment & tracking', mindbridge: true, sp: false },
  { feature: 'AHPRA-compliant, Australia-hosted data', mindbridge: true, sp: false },
  { feature: 'Mood & journal tracking for clients', mindbridge: true, sp: false },
  { feature: 'Free tier available', mindbridge: true, sp: false },
];

function Cell({ value }: { value: boolean | 'partial' }) {
  if (value === true) return <Check className="w-5 h-5 text-sage mx-auto" />;
  if (value === 'partial') return <Minus className="w-5 h-5 text-gold mx-auto" />;
  return <X className="w-5 h-5 text-text-muted mx-auto" />;
}

export default function CompareSimplePracticePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'MindBridge vs SimplePractice',
            description:
              'Feature comparison of MindBridge (Australian) and SimplePractice (US) practice management software.',
            url: 'https://mindbridge.com.au/compare/simplepractice',
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Comparison</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
            MindBridge vs SimplePractice
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            SimplePractice is designed for the US market. Australian psychologists need Medicare billing, MHTP
            Better Access tracking, and data hosted in Australia. MindBridge was built for exactly that.
          </p>
        </div>

        {/* Australia-specific callout */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-4 mb-10 flex gap-3 items-start">
          <span className="text-xl mt-0.5">🇦🇺</span>
          <div>
            <p className="font-semibold text-text-primary text-sm">SimplePractice does not support Australian Medicare billing</p>
            <p className="text-sm text-text-secondary mt-1">
              If you're a registered psychologist under the Better Access initiative, you need software that tracks
              MHTP session counts and Medicare item numbers. MindBridge handles this natively.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-14">
          {[
            {
              icon: '🇦🇺',
              title: 'Built for Australia',
              desc: 'MHTP Better Access tracking, Medicare item numbers, AHPRA compliance. Data stored in Australia — not US servers.',
            },
            {
              icon: '🤖',
              title: 'Superior AI notes',
              desc: 'MindBridge generates full SOAP/DAP/BIRP/Narrative notes from audio. SimplePractice offers basic dictation assistance only.',
            },
            {
              icon: '💰',
              title: 'Free to start',
              desc: 'SimplePractice starts at USD $29/month. MindBridge has a free tier — no credit card required.',
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
                <th className="px-6 py-4 font-semibold text-text-secondary">SimplePractice</th>
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={row.feature} className={i % 2 === 0 ? 'bg-white' : 'bg-cream'}>
                  <td className="px-6 py-3 text-text-secondary">{row.feature}</td>
                  <td className="px-6 py-3 text-center"><Cell value={row.mindbridge} /></td>
                  <td className="px-6 py-3 text-center"><Cell value={row.sp as boolean | 'partial'} /></td>
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
          <h2 className="text-2xl font-display font-bold mb-3">The Australian alternative to SimplePractice</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Purpose-built for Australian clinicians. Free to try, no card required.
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
