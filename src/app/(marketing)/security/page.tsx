import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security & Data Privacy — MindBridge for Australian Psychologists',
  description:
    'How MindBridge protects your client data. Australian data sovereignty, end-to-end encryption, AHPRA-compliant record handling, and full audit logging. No client data used for AI training.',
  alternates: { canonical: 'https://mindbridge.com.au/security' },
};

export default function SecurityPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Security</p>
        <h1 className="text-4xl font-display font-bold text-text-primary mb-5">
          Your clients' data is safe with MindBridge
        </h1>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          Mental health records are among the most sensitive data that exists. We treat security not as a
          feature but as a fundamental requirement.
        </p>
      </div>

      {/* Key commitments */}
      <div className="grid sm:grid-cols-2 gap-6 mb-12">
        {[
          {
            icon: '🇦🇺',
            title: 'Australian data sovereignty',
            body: 'All client data is stored in Australian data centres. We do not transfer health information to overseas servers. Your data stays in Australia.',
          },
          {
            icon: '🔒',
            title: 'Encrypted everywhere',
            body: 'Data is encrypted in transit (TLS 1.3) and at rest (AES-256). Session notes, client records, and messages are all encrypted.',
          },
          {
            icon: '🤖',
            title: 'AI never trains on your data',
            body: 'Your clinical notes and client information are never used to train AI models — not ours, not Anthropic\'s. Zero-data-retention agreements are in place.',
          },
          {
            icon: '📋',
            title: 'Full audit logging',
            body: 'Every access to a client record is logged with timestamp and user. You can see exactly who accessed what and when — critical for AHPRA compliance.',
          },
          {
            icon: '✍️',
            title: 'Tamper-evident notes',
            body: 'Once a clinical note is signed, it is cryptographically locked. Any attempt to alter a signed note is logged and flagged.',
          },
          {
            icon: '🔑',
            title: 'Independent client auth',
            body: 'Clients authenticate with their own credentials. Clinicians cannot log in as a client, and clients cannot access clinician tools.',
          },
        ].map((item) => (
          <div key={item.title} className="bg-white rounded-xl shadow-soft p-6">
            <div className="text-2xl mb-3">{item.icon}</div>
            <h3 className="font-semibold text-text-primary mb-2">{item.title}</h3>
            <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
          </div>
        ))}
      </div>

      {/* AHPRA AI guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 mb-10">
        <h2 className="font-semibold text-text-primary mb-2">AHPRA AI guidelines compliance</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-3">
          In 2024, AHPRA and the National Boards published guidance on the use of AI in health practice.
          MindBridge is designed to comply with these guidelines:
        </p>
        <ul className="space-y-1.5">
          {[
            'AI-generated notes are clearly marked as drafts — clinicians must review and sign',
            'The registered practitioner remains responsible for all clinical documentation',
            'No AI output is treated as clinical advice or diagnosis',
            'Clients can request human review of any AI-assisted process',
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm text-text-secondary">
              <span className="text-sage shrink-0">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Privacy Act */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-10">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Privacy Act 1988 alignment</h2>
        <p className="text-sm text-text-secondary leading-relaxed mb-4">
          As a health service provider, you are bound by the Australian Privacy Principles (APPs) under the
          Privacy Act 1988. MindBridge is designed to help you meet your obligations:
        </p>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            'Client consent captured and stored at account creation',
            'Clients can access and correct their own data on request',
            'Data is only collected for the purpose of providing health services',
            'Third-party sub-processors are documented and contractually bound',
            'Data breach procedures documented and tested',
            'Full data export for client portability rights',
          ].map((item) => (
            <div key={item} className="flex gap-2 text-sm text-text-secondary">
              <span className="text-sage shrink-0">✓</span>
              {item}
            </div>
          ))}
        </div>
      </div>

      {/* Sub-processors */}
      <div className="bg-white rounded-2xl shadow-soft p-8 mb-12">
        <h2 className="text-xl font-display font-bold text-text-primary mb-4">Infrastructure & sub-processors</h2>
        <div className="space-y-3 text-sm">
          {[
            { name: 'Supabase (PostgreSQL)', role: 'Database and authentication', location: 'Australia (ap-southeast-2)' },
            { name: 'Vercel', role: 'Application hosting and edge functions', location: 'Australia region' },
            { name: 'Anthropic (Claude)', role: 'AI note generation — zero data retention', location: 'API only, no storage' },
            { name: 'OpenAI (Whisper)', role: 'Audio transcription — zero data retention', location: 'API only, no storage' },
            { name: 'Resend', role: 'Transactional email (appointment reminders)', location: 'Encrypted in transit' },
          ].map((p) => (
            <div key={p.name} className="grid grid-cols-3 gap-4 py-2 border-b border-beige last:border-0">
              <span className="font-medium text-text-primary">{p.name}</span>
              <span className="text-text-secondary">{p.role}</span>
              <span className="text-text-muted">{p.location}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <p className="text-text-secondary mb-4">Security questions or to report a vulnerability:</p>
        <a
          href="mailto:security@mindbridge.com.au"
          className="btn-primary px-8 py-3 rounded-xl font-semibold inline-block"
        >
          security@mindbridge.com.au
        </a>
      </div>
    </div>
  );
}
