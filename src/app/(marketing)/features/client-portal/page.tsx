import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Age-Adaptive Client Portal for Psychology Practices — MindBridge',
  description:
    'MindBridge gives every client a secure portal to track mood, complete homework, write in their journal, and message their clinician — with different interfaces for children, teens, and adults.',
  alternates: { canonical: 'https://mindbridge.com.au/features/client-portal' },
  openGraph: {
    title: 'Client Portal for Psychology Practices — MindBridge',
    description:
      'A therapeutic client portal that adapts to age. Children, teens, and adults all get an interface designed for them — with mood tracking, homework, journaling, and secure messaging.',
    url: 'https://mindbridge.com.au/features/client-portal',
    type: 'website',
  },
};

const portalFeatures = [
  {
    icon: '📈',
    title: 'Mood tracking',
    body: 'Clients log daily mood with optional notes. Trends are visible to both client and clinician, supporting session preparation and outcome monitoring.',
  },
  {
    icon: '📝',
    title: 'Homework & exercises',
    body: 'Assign worksheets, thought records, or custom tasks. Clients complete them in the portal and clinicians review progress before the next session.',
  },
  {
    icon: '📖',
    title: 'Private journal',
    body: 'A secure, searchable journal for reflection. Optional sharing with clinician. Supports narrative therapy and CBT self-monitoring approaches.',
  },
  {
    icon: '💬',
    title: 'Secure messaging',
    body: 'HIPAA/AHPRA-aligned encrypted messaging between client and clinician. No SMS, no unsecured email — all communication stays inside MindBridge.',
  },
  {
    icon: '🛡️',
    title: 'Safety plan access',
    body: 'Clients can view their personalised safety plan 24/7 from the portal — accessible even when not logged into a full session.',
  },
  {
    icon: '📊',
    title: 'Outcome measures',
    body: 'Clinicians send PHQ-9, GAD-7, K10, or DASS-21 assessments directly to the client portal. Results flow back automatically.',
  },
];

const ageGroups = [
  {
    group: 'Children (under 13)',
    color: 'bg-coral/10 border-coral/30',
    dot: 'bg-coral',
    features: ['Simple emoji-based mood check-in', 'Game-inspired homework activities', 'Bright, friendly visual design', 'Parent/guardian co-access option'],
  },
  {
    group: 'Teens (13–17)',
    color: 'bg-calm/10 border-calm/30',
    dot: 'bg-calm',
    features: ['Mood wheel with nuanced options', 'Private journal with optional sharing', 'Peer-language interface tone', 'Homework with progress badges'],
  },
  {
    group: 'Adults (18+)',
    color: 'bg-sage/10 border-sage/30',
    dot: 'bg-sage',
    features: ['Full mood tracking with trend graphs', 'Clinical homework and thought records', 'Outcome measure self-reporting', 'Detailed session history access'],
  },
];

export default function ClientPortalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: 'Age-Adaptive Client Portal — MindBridge',
            description:
              'MindBridge provides a therapeutic client portal with mood tracking, homework, journaling, and messaging — with age-adaptive interfaces for children, teens, and adults.',
            url: 'https://mindbridge.com.au/features/client-portal',
          }),
        }}
      />

      {/* Hero */}
      <div className="bg-gradient-to-b from-sand to-cream pt-20 pb-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Feature</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-text-primary mb-5">
            A client portal that<br />adapts to every client
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-8">
            One portal for your whole caseload. Children, teens, and adults each get an interface designed for
            their age — with mood tracking, homework, journaling, and secure messaging built in.
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
        {/* Portal features */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-10">
            Everything your clients need between sessions
          </h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {portalFeatures.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl shadow-soft p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-text-primary mb-1 text-sm">{f.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Age-adaptive */}
        <div className="mb-16">
          <h2 className="text-2xl font-display font-bold text-text-primary text-center mb-4">
            One codebase, three experiences
          </h2>
          <p className="text-center text-text-secondary mb-10 max-w-xl mx-auto text-sm">
            You set the client&apos;s age group when you create their profile. The portal adjusts its interface, tone,
            and activities automatically.
          </p>
          <div className="grid md:grid-cols-3 gap-5">
            {ageGroups.map((ag) => (
              <div key={ag.group} className={`rounded-xl border p-6 ${ag.color}`}>
                <div className="flex items-center gap-2 mb-4">
                  <span className={`w-3 h-3 rounded-full ${ag.dot}`} />
                  <p className="font-semibold text-text-primary text-sm">{ag.group}</p>
                </div>
                <ul className="space-y-2">
                  {ag.features.map((feat) => (
                    <li key={feat} className="flex gap-2 text-xs text-text-secondary">
                      <span className="text-sage">✓</span>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="bg-white rounded-2xl shadow-soft p-8 mb-16">
          <h2 className="text-xl font-display font-bold text-text-primary mb-4">Security & compliance</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              'All data encrypted in transit and at rest',
              'Australia-based data storage (no US servers)',
              'AHPRA-aligned data handling practices',
              'Clients authenticate with their own credentials',
              'Clinicians control what clients can see and do',
              'Session notes are never visible to clients',
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm text-text-secondary">
                <span className="text-sage">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-sage rounded-2xl p-10 text-center text-white">
          <h2 className="text-2xl font-display font-bold mb-3">Give your clients a portal they&apos;ll actually use</h2>
          <p className="text-sage-light mb-6 max-w-md mx-auto">
            Extend therapy beyond the 50-minute session with tools clients engage with between appointments.
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
