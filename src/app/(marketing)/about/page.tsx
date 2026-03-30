import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About MindBridge — Practice Management Built in Australia',
  description:
    'MindBridge is an Australian-built practice management platform for psychologists and mental health clinicians. AI-powered, AHPRA-compliant, and designed around how clinicians actually work.',
  alternates: { canonical: 'https://mindbridge.com.au/about' },
};

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">About</p>
        <h1 className="text-4xl font-display font-bold text-text-primary mb-5">
          Built in Australia, for Australian clinicians
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          MindBridge was built because the tools Australian psychologists were using weren't built for them.
          US-centric software, manual session counting, and hours of note-writing every week — we think
          clinicians deserve better.
        </p>
      </div>

      {/* Mission */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-10">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Our mission</h2>
        <p className="text-text-secondary leading-relaxed mb-4">
          Every hour a psychologist spends on admin is an hour not spent with a client. MindBridge exists to
          eliminate the documentation burden — not by cutting corners on clinical quality, but by using AI
          to handle the parts of the job that don't require a clinician's expertise.
        </p>
        <p className="text-text-secondary leading-relaxed">
          We believe technology should extend therapeutic relationships, not complicate them. That's why every
          feature we build — from the AI note generator to the age-adaptive client portal — is designed with
          the therapeutic relationship at the centre.
        </p>
      </div>

      {/* Values */}
      <div className="grid sm:grid-cols-2 gap-6 mb-10">
        {[
          {
            title: 'Clinician-first design',
            body: 'Every feature starts with "what does a working psychologist actually need?" Not "what looks impressive in a demo."',
          },
          {
            title: 'Australian by default',
            body: 'MHTP Better Access tracking, Medicare item numbers, AHPRA-compliant data handling, and data stored in Australian data centres. Not bolted on — built in.',
          },
          {
            title: 'AI that assists, not replaces',
            body: 'The AI generates a draft note. You review it, edit it, and sign it. Clinical judgment stays with the clinician — always.',
          },
          {
            title: 'Client safety first',
            body: "Safety plans, risk tracking, and crisis resources are features, not afterthoughts. We build for the full complexity of mental health practice.",
          },
        ].map((v) => (
          <div key={v.title} className="bg-white rounded-xl shadow-soft p-6">
            <h3 className="font-semibold text-text-primary mb-2">{v.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{v.body}</p>
          </div>
        ))}
      </div>

      {/* Who we serve */}
      <div className="bg-sage/10 border border-sage/20 rounded-2xl p-8 mb-10">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Who we serve</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { role: 'Registered Psychologists', note: 'AHPRA-registered, including endorsement-area specialists' },
            { role: 'Counsellors', note: 'ACA and PACFA members in private practice' },
            { role: 'Social Workers', note: 'AASW members with mental health practice roles' },
          ].map((r) => (
            <div key={r.role}>
              <p className="font-semibold text-text-primary text-sm mb-1">{r.role}</p>
              <p className="text-xs text-text-secondary">{r.note}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AHPRA / compliance */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-10">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">AHPRA & compliance</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-4">
          MindBridge is designed to support compliance with the Australian Health Practitioner Regulation
          Agency (AHPRA) standards, the Privacy Act 1988, and the Australian Privacy Principles (APPs). Key
          design decisions include:
        </p>
        <ul className="space-y-2">
          {[
            'All client data stored in Australian data centres (no international data transfers)',
            'Clinical notes are locked after signing — tamper-evident and audit-logged',
            'Clients authenticate independently — clinicians cannot access client credentials',
            'AI-generated notes are clearly marked as drafts until clinician-reviewed and signed',
            'Data export available at any time — no vendor lock-in on your clinical records',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-text-secondary">
              <span className="text-sage shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="text-center">
        <Link href="/auth/signup" className="btn-primary px-8 py-3 rounded-xl font-semibold inline-block">
          Start free trial
        </Link>
        <p className="text-sm text-text-muted mt-3">
          Questions? Email us at{' '}
          <a href="mailto:hello@mindbridge.com.au" className="text-sage hover:underline">
            hello@mindbridge.com.au
          </a>
        </p>
      </div>
    </div>
  );
}
