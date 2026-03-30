import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Practice Management Software for Australian Counsellors — MindBridge',
  description:
    'MindBridge helps Australian counsellors manage clients, write clinical notes with AI, track homework and outcomes, and communicate securely — without the complexity of medical-grade systems.',
  alternates: { canonical: 'https://mindbridge.com.au/for/counsellors' },
  openGraph: {
    title: 'Practice Management for Australian Counsellors — MindBridge',
    description:
      'Streamline your counselling practice with AI notes, a therapeutic client portal, and outcome tracking. Built for Australian counsellors and social workers.',
    url: 'https://mindbridge.com.au/for/counsellors',
    type: 'website',
  },
};

export default function ForCounsellorsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Practice Management Software for Australian Counsellors — MindBridge',
            description:
              'MindBridge helps Australian counsellors manage clients, write AI-assisted notes, and support client wellbeing between sessions.',
            url: 'https://mindbridge.com.au/for/counsellors',
            audience: {
              '@type': 'MedicalAudience',
              audienceType: 'Counsellor, Social Worker, Mental Health Clinician',
              geographicArea: { '@type': 'Country', name: 'Australia' },
            },
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">For Counsellors</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            Less admin.<br />More client time.
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            MindBridge gives Australian counsellors, social workers, and mental health practitioners the tools
            to run a modern, client-centred practice — without the overhead of enterprise software.
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
        {/* Core value props */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            {
              icon: '✍️',
              title: 'AI-assisted session notes',
              body: 'Record your session and generate a SOAP, DAP, or Narrative note in seconds. Spend your energy on clients — not paperwork.',
            },
            {
              icon: '👩‍💻',
              title: 'Therapeutic client portal',
              body: 'Clients track mood, complete between-session tasks, journal privately, and message you securely — all from one place.',
            },
            {
              icon: '📊',
              title: 'Outcome measures',
              body: 'Send PHQ-9, GAD-7, K10, and DASS-21 questionnaires directly to clients and track their wellbeing over time.',
            },
          ].map((f) => (
            <div key={f.title} className="bg-white rounded-2xl shadow-soft p-6">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-text-primary mb-2">{f.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed">{f.body}</p>
            </div>
          ))}
        </div>

        {/* Who is it for */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">
            Who uses MindBridge
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'Registered counsellors (ACA, PACFA)',
              'Social workers in private practice',
              'Mental health social workers',
              'Employee Assistance Programme (EAP) practitioners',
              'Grief and bereavement counsellors',
              'Relationship and couples counsellors',
              'School counsellors in private practice',
              'Allied health practitioners with a counselling caseload',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-sage">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Features list */}
        <div className="mb-14">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-8">
            Everything you need to run your practice
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: '📅', title: 'Appointment scheduling', body: 'Book and manage sessions with automated 24h and 48h email reminders to reduce no-shows.' },
              { icon: '🗂️', title: 'Client profiles', body: 'Store contact details, consent records, billing type, and notes against each client — accessible from one screen.' },
              { icon: '🔒', title: 'Signed, locked notes', body: 'Notes are tamper-evident once signed. Meets PACFA, ACA, and AASW documentation requirements.' },
              { icon: '🛡️', title: 'Safety planning', body: 'Build and store a personalised safety plan with each client. Clients can access it 24/7 from their portal.' },
              { icon: '📚', title: 'Resource library', body: 'Upload and share psychoeducation handouts, worksheets, and guided exercises directly to clients.' },
              { icon: '📱', title: 'Works on mobile', body: 'MindBridge is a responsive web app — clinicians and clients can use it on any device, anywhere.' },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-xl shadow-soft p-5 flex gap-4">
                <span className="text-2xl">{f.icon}</span>
                <div>
                  <p className="font-semibold text-text-primary text-sm mb-1">{f.title}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{f.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Privacy */}
        <div className="bg-sage/10 border border-sage/20 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-display font-bold text-text-primary mb-3">Privacy is foundational</h2>
          <p className="text-text-secondary text-sm leading-relaxed">
            Counselling clients share deeply personal information. MindBridge stores all data in Australian data
            centres, encrypts everything in transit and at rest, and never uses client data for AI training.
            You own your data — always.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Start your free MindBridge account</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Set up in minutes. No credit card, no lock-in contract.
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
