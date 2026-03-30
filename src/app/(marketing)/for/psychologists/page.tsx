import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practice Management Software for Australian Psychologists — MindBridge',
  description:
    'MindBridge is built for registered psychologists in Australia. AI clinical notes, MHTP Better Access session tracking, Medicare billing, and an age-adaptive client portal — all in one platform.',
  alternates: { canonical: 'https://mindbridge.com.au/for/psychologists' },
  openGraph: {
    title: 'Practice Management for Australian Psychologists — MindBridge',
    description:
      'The only practice management platform designed specifically for Australian psychologists. AI notes, MHTP tracking, Medicare billing, AHPRA compliance — free to try.',
    url: 'https://mindbridge.com.au/for/psychologists',
    type: 'website',
  },
};

const painPoints = [
  {
    problem: 'Spending 1–2 hours writing notes every evening',
    solution: 'AI generates SOAP, DAP, BIRP, or Narrative notes from session audio in under 30 seconds.',
  },
  {
    problem: 'Manually counting Better Access sessions in a spreadsheet',
    solution: 'MindBridge tracks MHTP sessions, GP referral numbers, and expiry dates automatically.',
  },
  {
    problem: 'Chasing clients between sessions with homework and check-ins',
    solution: 'Clients complete homework, log mood, and message you securely in their MindBridge portal.',
  },
  {
    problem: 'Forgetting to administer PHQ-9 or K10 outcome measures',
    solution: 'Send assessments to clients from the platform and receive results before the next session.',
  },
  {
    problem: 'No safety plan visible to clients in a crisis',
    solution: 'Clients can access their co-created safety plan 24/7 from their portal.',
  },
];

export default function ForPsychologistsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Practice Management Software for Australian Psychologists — MindBridge',
            description:
              'MindBridge is purpose-built for registered psychologists in Australia with AI notes, MHTP tracking, and a therapeutic client portal.',
            url: 'https://mindbridge.com.au/for/psychologists',
            audience: {
              '@type': 'MedicalAudience',
              audienceType: 'Psychologist',
              geographicArea: { '@type': 'Country', name: 'Australia' },
            },
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">For Psychologists</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            Practice management<br />built for psychologists
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            MindBridge is the only Australian practice management platform with built-in AI note generation,
            MHTP Better Access tracking, and a therapeutic client portal — designed around how psychologists
            actually work.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/auth/signup" className="btn-primary px-8 py-3 rounded-xl font-semibold">
              Start free — no card needed
            </Link>
            <Link href="/demo" className="btn-secondary px-8 py-3 rounded-xl font-semibold">
              See live demo
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-16">
        {/* Pain points → solutions */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-4">
            Built around how you actually work
          </h2>
          <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto text-sm">
            We spoke to Australian psychologists about what slows them down. MindBridge solves the five most common problems.
          </p>
          <div className="space-y-4">
            {painPoints.map((p, i) => (
              <div key={i} className="bg-white rounded-xl shadow-soft p-6 grid sm:grid-cols-2 gap-4">
                <div className="flex gap-3">
                  <span className="text-coral text-lg">✗</span>
                  <p className="text-sm text-text-secondary">{p.problem}</p>
                </div>
                <div className="flex gap-3">
                  <span className="text-sage text-lg">✓</span>
                  <p className="text-sm text-text-primary font-medium">{p.solution}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AHPRA & compliance */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">
            AHPRA compliance is non-negotiable
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-6">
            As a registered psychologist you have strict documentation and data handling obligations under AHPRA, the
            Privacy Act 1988, and the Australian Privacy Principles. MindBridge is designed with these obligations
            at its core.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              'Client data stored in Australian data centres',
              'Signed notes are locked and tamper-evident',
              'Full audit log of all record access',
              'Encrypted in transit and at rest',
              'Consent capture and storage built-in',
              'Client data exportable at any time',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-sage">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Better Access deep dive */}
        <div className="bg-sage/10 border border-sage/20 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-3">
            Better Access tracking — finally sorted
          </h2>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">
            Every client under the Better Access initiative gets up to 20 individual sessions per calendar year.
            Tracking session counts, referral review dates, and GP details across a full caseload is error-prone
            without the right tools.
          </p>
          <p className="text-text-secondary text-sm leading-relaxed">
            MindBridge tracks it all automatically. Dashboard alerts fire when a client has 2 sessions remaining or
            when a referral expires within 30 days — so you can act before care is disrupted.
          </p>
          <Link href="/features/mhtp-tracking" className="inline-block mt-4 text-sage text-sm font-medium hover:underline">
            See MHTP tracking in detail →
          </Link>
        </div>

        {/* Speciality support */}
        <div className="mb-14">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-8">
            Supports your specialty
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {[
              { title: 'CBT', body: 'Thought records, behavioural experiments, and homework trackers built into the client portal.' },
              { title: 'Trauma-informed', body: 'Safety planning, grounding resources, and a calm UI designed to reduce client anxiety.' },
              { title: 'Child psychology', body: 'Age-adaptive portal with parent co-access, game-like activities, and developmentally appropriate language.' },
              { title: 'Adolescent', body: 'Peer-tone interface, private journal, and mood wheel with nuanced emotional vocabulary.' },
              { title: 'Assessment & diagnosis', body: 'Link standardised measures to client records and track scores over time for longitudinal monitoring.' },
              { title: 'Group therapy', body: 'Manage multiple clients efficiently with a caseload view, bulk alerts, and quick-access session prep.' },
            ].map((s) => (
              <div key={s.title} className="bg-white rounded-xl shadow-soft p-5">
                <p className="font-semibold text-text-primary text-sm mb-1">{s.title}</p>
                <p className="text-xs text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Pricing nudge */}
        <div className="text-center text-sm text-text-muted mb-14">
          See how MindBridge compares →{' '}
          <Link href="/compare/cliniko" className="text-sage hover:underline">Cliniko</Link>,{' '}
          <Link href="/compare/halaxy" className="text-sage hover:underline">Halaxy</Link>,{' '}
          <Link href="/compare/simplepractice" className="text-sage hover:underline">SimplePractice</Link>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">The practice management software psychologists asked for</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Free to start. No lock-in. Set up in minutes — not days.
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
