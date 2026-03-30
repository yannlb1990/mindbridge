import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'AI Clinical Note Generation — SOAP, DAP, BIRP for Psychologists | MindBridge',
  description:
    'Generate SOAP, DAP, BIRP, and Narrative clinical notes in seconds with MindBridge AI. Record your session, choose your format, and get a complete note ready to sign — built for Australian psychologists.',
  alternates: { canonical: 'https://mindbridge.com.au/features/ai-notes' },
  openGraph: {
    title: 'AI Clinical Note Generation for Australian Psychologists — MindBridge',
    description:
      'Stop spending evenings writing notes. MindBridge AI generates SOAP, DAP, BIRP, and Narrative notes from your session audio in seconds.',
    url: 'https://mindbridge.com.au/features/ai-notes',
    type: 'website',
  },
};

const formats = [
  {
    name: 'SOAP',
    desc: 'Subjective, Objective, Assessment, Plan — the gold standard for clinical documentation.',
    color: 'bg-sage/10 border-sage/30',
  },
  {
    name: 'DAP',
    desc: 'Data, Assessment, Plan — concise and favoured by many Australian psychologists.',
    color: 'bg-calm/10 border-calm/30',
  },
  {
    name: 'BIRP',
    desc: 'Behaviour, Intervention, Response, Plan — ideal for structured therapy approaches.',
    color: 'bg-gold/20 border-gold/40',
  },
  {
    name: 'Narrative',
    desc: 'Free-flowing clinical narrative — great for complex presentations or court-admissible notes.',
    color: 'bg-coral/10 border-coral/30',
  },
];

const steps = [
  { n: '1', title: 'Record your session', body: 'Click record in MindBridge and speak naturally. The AI transcribes your session audio in real time using advanced speech recognition.' },
  { n: '2', title: 'Choose your format', body: 'Select SOAP, DAP, BIRP, or Narrative. MindBridge maps the transcript to the correct sections automatically.' },
  { n: '3', title: 'Review and sign', body: 'Your note appears in seconds. Edit any section, then sign it with one click to lock it in the clinical record.' },
];

export default function AiNotesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'AI Clinical Note Generation — MindBridge',
            description:
              'MindBridge AI generates SOAP, DAP, BIRP, and Narrative clinical notes from session audio for Australian psychologists.',
            url: 'https://mindbridge.com.au/features/ai-notes',
            mainEntity: {
              '@type': 'SoftwareApplication',
              name: 'MindBridge AI Note Generation',
              featureList: ['SOAP note generation', 'DAP note generation', 'BIRP note generation', 'Narrative note generation', 'Audio transcription'],
            },
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Feature</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            AI Clinical Notes<br />in seconds, not hours
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            Record your session, pick your format, and get a complete SOAP, DAP, BIRP, or Narrative note ready to review and sign. MindBridge eliminates the documentation burden that steals your evenings.
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
        {/* How it works */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((s) => (
              <div key={s.n} className="bg-white rounded-2xl shadow-soft p-6">
                <div className="w-10 h-10 bg-sage text-white rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {s.n}
                </div>
                <h3 className="font-semibold text-text-primary mb-2">{s.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Note formats */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-4">
            Every format you use
          </h2>
          <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto">
            MindBridge supports the four note formats most used by Australian mental health clinicians.
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {formats.map((f) => (
              <div key={f.name} className={`rounded-xl border p-6 ${f.color}`}>
                <p className="text-lg font-bold text-text-primary mb-1">{f.name}</p>
                <p className="text-sm text-text-secondary">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Benefits */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-16">
          <h2 className="text-xl font-display font-bold text-text-primary mb-6">Built for clinical quality</h2>
          <ul className="space-y-4">
            {[
              'Notes reflect the structure of the session — not generic boilerplate',
              'Automatically extracts client goals, interventions used, and homework assigned',
              'You review and edit before signing — the AI assists, you decide',
              'Notes are locked after signing to meet AHPRA documentation standards',
              'Works alongside telehealth sessions via link or in-person recording',
            ].map((item) => (
              <li key={item} className="flex gap-3 text-text-secondary text-sm">
                <span className="text-sage font-bold mt-0.5">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Time savings callout */}
        <div className="grid sm:grid-cols-3 gap-6 mb-16 text-center">
          {[
            { stat: '~45 min', label: 'Average time saved per day on notes' },
            { stat: '4 formats', label: 'SOAP, DAP, BIRP, Narrative supported' },
            { stat: '<30 sec', label: 'From session end to draft note' },
          ].map((s) => (
            <div key={s.stat} className="bg-sand rounded-xl p-6">
              <p className="text-3xl font-bold text-sage mb-1">{s.stat}</p>
              <p className="text-sm text-text-secondary">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Compare link */}
        <div className="text-center text-sm text-text-muted mb-16">
          Compare with other platforms →{' '}
          <Link href="/compare/cliniko" className="text-sage hover:underline">Cliniko</Link>,{' '}
          <Link href="/compare/halaxy" className="text-sage hover:underline">Halaxy</Link>,{' '}
          <Link href="/compare/simplepractice" className="text-sage hover:underline">SimplePractice</Link>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Stop writing notes at midnight</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Join Australian psychologists who use MindBridge to get their evenings back.
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
