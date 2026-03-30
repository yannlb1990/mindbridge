import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practice Management Software for Social Workers — MindBridge Australia',
  description:
    'MindBridge helps Australian social workers manage clients, write clinical notes with AI, track mental health outcomes, and support client wellbeing between sessions. AASW-aligned.',
  alternates: { canonical: 'https://mindbridge.com.au/for/social-workers' },
  openGraph: {
    title: 'Practice Management for Australian Social Workers — MindBridge',
    description: 'Streamline your social work practice with AI notes, outcome tracking, and a secure client portal. Built for AASW members in private practice.',
    url: 'https://mindbridge.com.au/for/social-workers',
    type: 'website',
  },
};

export default function ForSocialWorkersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Practice Management Software for Australian Social Workers — MindBridge',
            url: 'https://mindbridge.com.au/for/social-workers',
            audience: {
              '@type': 'MedicalAudience',
              audienceType: 'Social Worker',
              geographicArea: { '@type': 'Country', name: 'Australia' },
            },
          }),
        }}
      />

      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">For Social Workers</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            Practice management<br />for social workers
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            MindBridge supports AASW members in private practice with AI clinical notes, a therapeutic
            client portal, and the documentation tools needed for mental health, family, and case management work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="btn-primary px-8 py-3 rounded-xl font-semibold">Start free — no card needed</Link>
            <Link href="/demo" className="btn-secondary px-8 py-3 rounded-xl font-semibold">See live demo</Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { icon: '✍️', title: 'AI-assisted case notes', body: 'Generate SOAP, DAP, or Narrative notes from session recordings in seconds — leaving more time for direct service.' },
            { icon: '👨‍👩‍👧', title: 'Family and individual work', body: 'Manage complex caseloads with individual client profiles, family relationship mapping, and risk tracking.' },
            { icon: '📊', title: 'Outcome measurement', body: 'Track K10, PHQ-9, and DASS-21 scores over time to demonstrate treatment effectiveness and meet funding requirements.' },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">Designed for the complexity of social work</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Risk assessment and safety planning for vulnerable clients',
              'Multi-agency coordination notes and case history',
              'Child, adolescent, and adult-appropriate client portals',
              'Secure clinician–client messaging (no SMS, no unsecured email)',
              'Homework and between-session exercise tracking',
              'Consent and intake documentation storage',
              'AASW documentation standards alignment',
              'NDIS and DVA billing type tracking',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-sage">✓</span>{item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-sage/10 border border-sage/20 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-3">Mental health social workers</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            Accredited Mental Health Social Workers (AMHSWs) providing services under the Better Access
            initiative can use MindBridge to track MHTP sessions, GP referral numbers, and referral expiry
            dates — the same tools available to registered psychologists.
          </p>
          <Link href="/features/mhtp-tracking" className="inline-block mt-4 text-sage text-sm font-medium hover:underline">
            See MHTP tracking in detail →
          </Link>
        </div>

        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Start your free MindBridge account</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">No credit card, no lock-in. Set up in minutes.</p>
          <Link href="/auth/signup" className="inline-block bg-white text-sage font-semibold px-8 py-3 rounded-xl hover:bg-cream transition-colors">
            Start free trial
          </Link>
        </div>
      </div>
    </>
  );
}
