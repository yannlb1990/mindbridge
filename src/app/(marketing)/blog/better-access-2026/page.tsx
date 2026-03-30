import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Better Access Initiative 2026 — What Australian Psychologists Need to Know',
  description:
    'What changed in the Better Access initiative and what stays the same in 2026. Session limits, GP review requirements, telehealth Medicare items, and practice implications for Australian psychologists.',
  alternates: { canonical: 'https://mindbridge.com.au/blog/better-access-2026' },
  openGraph: {
    title: 'Better Access 2026 — What Changed for Australian Psychologists',
    description: 'Current session limits, GP review requirements, telehealth Medicare items, and what your practice needs to know about Better Access in 2026.',
    url: 'https://mindbridge.com.au/blog/better-access-2026',
    type: 'article',
  },
};

export default function BetterAccess2026Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Better Access Initiative 2026 — What Australian Psychologists Need to Know',
            url: 'https://mindbridge.com.au/blog/better-access-2026',
            author: { '@type': 'Organization', name: 'MindBridge', url: 'https://mindbridge.com.au' },
            publisher: { '@type': 'Organization', name: 'MindBridge', url: 'https://mindbridge.com.au' },
            datePublished: '2026-02-01',
            inLanguage: 'en-AU',
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium bg-sage/10 text-sage px-2.5 py-1 rounded-full">Policy</span>
            <span className="text-xs text-text-muted">February 2026 · 6 min read</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-5 leading-tight">
            Better Access in 2026: What Changed and What It Means for Your Practice
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            After the 2022 pandemic-era expansion to 20 sessions, the Better Access initiative has stabilised.
            Here&apos;s a clear summary of the current rules, what has changed in recent years, and what
            Australian psychology practices need to have in place.
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-text-secondary">
          <div className="bg-sage/10 border border-sage/20 rounded-xl px-6 py-5">
            <p className="font-semibold text-text-primary text-sm mb-2">Current state (2026)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><strong>20 individual sessions</strong> per calendar year — maintained from the 2022 expansion</li>
              <li>Telehealth (video and phone) sessions are <strong>permanently Medicare-rebatable</strong></li>
              <li>GP review required after session 6 and after session 10</li>
              <li>Group therapy sessions: up to 12 per year under separate items</li>
            </ul>
          </div>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Brief history: how we got to 20 sessions</h2>
            <p>
              The Better Access initiative launched in 2006 with 12 sessions per year. In March 2020, this
              was temporarily increased to 20 sessions in response to COVID-19. After extensive advocacy
              from the APS and other professional bodies, the 20-session limit was made permanent from
              1 January 2023.
            </p>
            <p className="mt-3">
              In 2022, Services Australia also permanently extended telehealth Medicare items for psychology,
              meaning video and phone sessions are now a permanent feature of Better Access — not a temporary
              pandemic measure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">What hasn&apos;t changed</h2>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>A valid MHTP from a GP, psychiatrist, or paediatrician is still required</li>
              <li>The 20 sessions reset each calendar year (1 January)</li>
              <li>Unused sessions do not carry over to the following year</li>
              <li>Clinical psychologists and registered psychologists have different item numbers and fee schedules</li>
              <li>Social workers and occupational therapists access Better Access under separate item numbers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Telehealth: what&apos;s now permanent</h2>
            <p>
              Telehealth psychology under Medicare is now a permanent feature of the MBS. Clients can
              access services by video (item 80005/80020) or phone (item 80010) without needing to be in
              a specific geographic location. The key rules:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>The service must be clinically appropriate for telehealth delivery</li>
              <li>The clinician must be satisfied the service is safe to deliver remotely</li>
              <li>Documentation must note that the service was delivered via telehealth</li>
              <li>Phone-only sessions (item 80010) have specific eligibility criteria — check MBS Online</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">What your practice needs to have in place</h2>
            <div className="space-y-3">
              {[
                { title: 'Session count tracking per calendar year', body: 'You are responsible for knowing how many sessions each client has used. If you claim beyond 20 sessions (or beyond 6/10 without review), you are liable for Medicare fraud.' },
                { title: 'GP review letter before session 7 and session 11', body: 'You cannot claim sessions 7–10 without a GP review letter. This letter must be received before you claim those sessions, not after.' },
                { title: 'Telehealth consent and documentation', body: 'For telehealth sessions, document that the client consented to telehealth delivery and that you assessed it as clinically appropriate.' },
                { title: 'Current MHTP on file', body: 'Keep a copy of the MHTP and any review letters. These must be available for audit. Medicare audits are real and the consequences of non-compliance are serious.' },
              ].map((item) => (
                <div key={item.title} className="bg-white rounded-xl shadow-soft p-5">
                  <p className="font-semibold text-text-primary text-sm mb-1">✓ {item.title}</p>
                  <p className="text-sm text-text-secondary leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Managing this in your practice software</h2>
            <p>
              Tracking session counts manually is error-prone, especially for large caseloads. MindBridge
              automates the most critical compliance checks:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Session counter per client showing sessions used vs total allocated</li>
              <li>Dashboard alert when a client has 2 sessions remaining</li>
              <li>GP referral number and review date stored per client</li>
              <li>Alert 30 days before a referral review date is due</li>
            </ul>
            <div className="mt-5 flex gap-3">
              <Link href="/features/mhtp-tracking" className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm inline-block">
                MHTP tracking in MindBridge →
              </Link>
              <Link href="/blog/mhtp-guide" className="btn-secondary px-6 py-2.5 rounded-lg font-medium text-sm inline-block">
                Complete MHTP guide
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-beige text-sm text-text-muted">
          <p>
            <strong>Disclaimer:</strong> This article is for general information. Always verify current
            Medicare rules at{' '}
            <a href="https://www.mbsonline.gov.au" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">MBS Online</a>{' '}
            and{' '}
            <a href="https://www.servicesaustralia.gov.au" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">Services Australia</a>.
            Policy details change — consult a Medicare billing specialist for practice-specific advice.
          </p>
        </div>
      </div>
    </>
  );
}
