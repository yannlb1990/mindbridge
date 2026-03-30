import type { Metadata } from 'next';
import Link from 'next/link';
import { Check } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Pricing — MindBridge Practice Management for Australian Psychologists',
  description:
    'MindBridge is free to start. Get AI clinical notes, MHTP tracking, and a client portal — no credit card required. Upgrade as your practice grows.',
  alternates: { canonical: 'https://mindbridge.com.au/pricing' },
  openGraph: {
    title: 'MindBridge Pricing — Free to Start',
    description: 'Practice management software for Australian psychologists. Free tier available, no credit card required.',
    url: 'https://mindbridge.com.au/pricing',
    type: 'website',
  },
};

const plans = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    desc: 'For solo practitioners getting started.',
    highlight: false,
    features: [
      'Up to 10 active clients',
      'AI note generation (5/month)',
      'Client portal (mood & journal)',
      'Appointment scheduling',
      'Basic outcome measures',
      'Email appointment reminders',
      'Secure messaging',
    ],
    cta: 'Start free',
    href: '/auth/signup',
  },
  {
    name: 'Practitioner',
    price: '$49',
    period: 'AUD / month',
    desc: 'For established solo practices.',
    highlight: true,
    features: [
      'Unlimited active clients',
      'AI note generation (unlimited)',
      'MHTP / Better Access tracking',
      'All outcome measures (PHQ-9, GAD-7, K10, DASS-21)',
      'Safety plan management',
      'Homework & resource library',
      'Age-adaptive client portal',
      'Full audit log',
      'Priority support',
    ],
    cta: 'Start 14-day free trial',
    href: '/auth/signup',
  },
  {
    name: 'Practice',
    price: '$99',
    period: 'AUD / month',
    desc: 'For group practices and multiple clinicians.',
    highlight: false,
    features: [
      'Everything in Practitioner',
      'Up to 5 clinician accounts',
      'Admin and receptionist roles',
      'Shared client caseload view',
      'Practice-level reporting',
      'Custom branding on client portal',
      'Dedicated onboarding support',
    ],
    cta: 'Contact us',
    href: 'mailto:hello@mindbridge.com.au',
  },
];

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'MindBridge Pricing',
            description: 'Pricing plans for MindBridge practice management software for Australian psychologists.',
            url: 'https://mindbridge.com.au/pricing',
          }),
        }}
      />

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Pricing</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-4">
            Simple, honest pricing
          </h1>
          <p className="text-lg text-text-secondary max-w-xl mx-auto">
            Start free. No credit card required. Upgrade only when your practice needs it.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-7 flex flex-col ${
                plan.highlight
                  ? 'bg-sage text-white shadow-xl ring-2 ring-sage'
                  : 'bg-white shadow-soft'
              }`}
            >
              <p className={`text-sm font-medium uppercase tracking-wide mb-1 ${plan.highlight ? 'text-sage-light' : 'text-sage'}`}>
                {plan.name}
              </p>
              <div className="flex items-end gap-1 mb-1">
                <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-text-primary'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm mb-1.5 ${plan.highlight ? 'text-sage-light' : 'text-text-muted'}`}>
                  {plan.period}
                </span>
              </div>
              <p className={`text-sm mb-6 ${plan.highlight ? 'text-sage-light' : 'text-text-secondary'}`}>
                {plan.desc}
              </p>

              <ul className="space-y-2.5 flex-1 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className={`flex gap-2 text-sm ${plan.highlight ? 'text-white' : 'text-text-secondary'}`}>
                    <Check className={`w-4 h-4 mt-0.5 shrink-0 ${plan.highlight ? 'text-sage-light' : 'text-sage'}`} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`text-center py-3 rounded-xl font-semibold transition-colors ${
                  plan.highlight
                    ? 'bg-white text-sage hover:bg-cream'
                    : 'bg-sage text-white hover:bg-sage-dark'
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-6">Common questions</h2>
          <div className="space-y-5">
            {[
              {
                q: 'Is my client data stored in Australia?',
                a: 'Yes. All MindBridge data is stored in Australian data centres. We never transfer health data to overseas servers.',
              },
              {
                q: 'Can I cancel at any time?',
                a: "Yes. No lock-in contracts. Cancel your subscription from your settings page and you'll retain access until the end of your billing period.",
              },
              {
                q: 'Is MindBridge suitable for group practices?',
                a: 'The Practice plan supports up to 5 clinicians. For larger groups, contact us for an enterprise arrangement.',
              },
              {
                q: 'Does MindBridge submit Medicare claims directly?',
                a: 'Not currently. MindBridge tracks Medicare item numbers and MHTP sessions, but claims are submitted via your existing Medicare billing workflow.',
              },
              {
                q: 'What happens to my data if I cancel?',
                a: 'You can export all your client data, notes, and session history at any time before cancelling. We retain data for 90 days after cancellation for recovery purposes.',
              },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-beige pb-5 last:border-0 last:pb-0">
                <p className="font-semibold text-text-primary text-sm mb-1">{faq.q}</p>
                <p className="text-sm text-text-secondary leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <p className="text-text-muted text-sm mb-4">Still deciding? Compare MindBridge with other platforms:</p>
          <div className="flex justify-center gap-4 text-sm">
            <Link href="/compare/cliniko" className="text-sage hover:underline">vs Cliniko</Link>
            <Link href="/compare/halaxy" className="text-sage hover:underline">vs Halaxy</Link>
            <Link href="/compare/simplepractice" className="text-sage hover:underline">vs SimplePractice</Link>
          </div>
        </div>
      </div>
    </>
  );
}
