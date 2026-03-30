import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Complete Guide to MHTP Better Access Sessions 2026 — Australian Psychologists',
  description:
    'Everything you need to know about Mental Health Treatment Plans (MHTP) and Better Access sessions in 2026. Session limits, Medicare item numbers, GP referral requirements, and how to track it all.',
  alternates: { canonical: 'https://mindbridge.com.au/blog/mhtp-guide' },
  openGraph: {
    title: 'MHTP Better Access Guide 2026 — For Australian Psychologists',
    description: 'Session limits, Medicare item numbers, referral requirements, and practice management tips for the Better Access initiative.',
    url: 'https://mindbridge.com.au/blog/mhtp-guide',
    type: 'article',
  },
};

export default function MhtpGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'The Complete Guide to MHTP Better Access Sessions in 2026',
            description: 'Everything Australian psychologists need to know about Mental Health Treatment Plans, session limits, and Medicare item numbers.',
            url: 'https://mindbridge.com.au/blog/mhtp-guide',
            author: { '@type': 'Organization', name: 'MindBridge', url: 'https://mindbridge.com.au' },
            publisher: { '@type': 'Organization', name: 'MindBridge', url: 'https://mindbridge.com.au' },
            datePublished: '2026-03-01',
            inLanguage: 'en-AU',
            about: { '@type': 'MedicalWebPage', audience: { '@type': 'MedicalAudience', audienceType: 'Psychologist' } },
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs font-medium bg-sage/10 text-sage px-2.5 py-1 rounded-full">Medicare & Billing</span>
            <span className="text-xs text-text-muted">March 2026 · 8 min read</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-text-primary mb-5 leading-tight">
            The Complete Guide to MHTP Better Access Sessions in 2026
          </h1>
          <p className="text-lg text-text-secondary leading-relaxed">
            The Better Access initiative is the primary Medicare pathway for psychology services in Australia.
            This guide covers everything practising psychologists need to know — session limits, item numbers,
            referral requirements, and how to keep track without a spreadsheet.
          </p>
        </div>

        <div className="prose prose-sm max-w-none space-y-8 text-text-secondary">
          <div className="bg-sage/10 border border-sage/20 rounded-xl px-6 py-4">
            <p className="font-semibold text-text-primary text-sm mb-1">Quick summary (2026)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>Up to <strong>20 individual sessions</strong> per calendar year under Better Access</li>
              <li>Requires a valid <strong>Mental Health Treatment Plan (MHTP)</strong> from a GP or psychiatrist</li>
              <li>A <strong>GP review</strong> is required after the initial 6 sessions before accessing the remaining 14</li>
              <li>Sessions claim under <strong>Medicare item numbers 80000–80025</strong> (varies by provider type and session format)</li>
            </ul>
          </div>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">What is a Mental Health Treatment Plan?</h2>
            <p>A Mental Health Treatment Plan (MHTP) is a document prepared by a GP, psychiatrist, or paediatrician that:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Identifies the client's mental health condition and presenting problems</li>
              <li>Sets out the proposed treatment approach</li>
              <li>Refers the client to an eligible mental health professional under Medicare</li>
              <li>Is required for the client to access Medicare-subsidised psychology sessions</li>
            </ul>
            <p className="mt-3">Without a current MHTP, sessions cannot be claimed under Medicare's Better Access item numbers.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">How many sessions can clients access?</h2>
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-sand">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-text-primary">Sessions</th>
                    <th className="text-left px-4 py-3 font-semibold text-text-primary">Requirement</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Sessions 1–6', 'Valid MHTP from GP'],
                    ['Sessions 7–10', 'GP review letter (after session 6)'],
                    ['Sessions 11–20', 'Further GP review letter (after session 10)'],
                  ].map(([s, r]) => (
                    <tr key={s} className="border-t border-beige">
                      <td className="px-4 py-3 font-medium text-text-primary">{s}</td>
                      <td className="px-4 py-3 text-text-secondary">{r}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-text-muted">Sessions reset each calendar year (1 January). Unused sessions do not carry over.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Medicare item numbers for psychologists</h2>
            <div className="bg-white rounded-xl shadow-soft overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-sand">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Item</th>
                    <th className="text-left px-4 py-3 font-semibold">Service</th>
                    <th className="text-left px-4 py-3 font-semibold">Provider</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['80000', 'Individual psychological therapy (in person)', 'Registered psychologist'],
                    ['80005', 'Individual psychological therapy (telehealth video)', 'Registered psychologist'],
                    ['80010', 'Individual psychological therapy (phone)', 'Registered psychologist'],
                    ['80015', 'Individual psychological therapy (in person)', 'Clinical psychologist'],
                    ['80020', 'Individual psychological therapy (telehealth video)', 'Clinical psychologist'],
                    ['80025', 'Group therapy session', 'Registered or clinical psychologist'],
                  ].map(([item, service, provider]) => (
                    <tr key={item} className="border-t border-beige">
                      <td className="px-4 py-3 font-mono text-sage font-medium">{item}</td>
                      <td className="px-4 py-3 text-text-secondary">{service}</td>
                      <td className="px-4 py-3 text-text-muted text-xs">{provider}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-2 text-xs text-text-muted">Always verify current Medicare benefit amounts and item numbers on the MBS Online website — these change regularly.</p>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">What must be on the MHTP?</h2>
            <p>To be valid for Medicare claiming, the MHTP must include:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Patient's name and date of birth</li>
              <li>Name, provider number, and signature of the referring GP or psychiatrist</li>
              <li>Date the plan was prepared</li>
              <li>Mental health condition and presenting problems</li>
              <li>Referral to a named mental health professional or practice</li>
              <li>Proposed treatment and goals</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">Common mistakes that trigger Medicare audits</h2>
            <div className="space-y-3">
              {[
                { mistake: 'Claiming beyond 10 sessions without a GP review letter', fix: 'Track sessions carefully and request the review letter from the GP after session 6 and session 10.' },
                { mistake: 'Claiming sessions in the wrong calendar year', fix: 'Sessions reset on 1 January. Keep records per calendar year, not per referral date.' },
                { mistake: 'Using the wrong item number for telehealth vs in-person', fix: 'Item numbers differ for video (80005/80020) and phone (80010) — always check the format before claiming.' },
                { mistake: 'MHTP expiry not tracked', fix: "A referral doesn't expire by date — but the GP review requirement does create a checkpoint. Track session counts, not just dates." },
              ].map((m) => (
                <div key={m.mistake} className="bg-amber-50 border border-amber-100 rounded-xl p-4">
                  <p className="font-semibold text-text-primary text-sm mb-1">❌ {m.mistake}</p>
                  <p className="text-sm text-text-secondary">✓ {m.fix}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-3">How to track MHTP sessions in your practice</h2>
            <p>
              The most common approach is a spreadsheet — which works but introduces the risk of human error,
              especially for a full caseload. MindBridge tracks MHTP sessions automatically:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Each client profile shows sessions used vs total allocation</li>
              <li>Dashboard alerts fire when a client has 2 sessions remaining</li>
              <li>GP referral number and review date stored against each client</li>
              <li>Alerts sent 30 days before a referral review date</li>
            </ul>
            <div className="mt-5">
              <Link href="/features/mhtp-tracking" className="btn-primary px-6 py-2.5 rounded-lg font-medium text-sm inline-block">
                See MHTP tracking in MindBridge →
              </Link>
            </div>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-beige text-sm text-text-muted">
          <p>
            <strong>Disclaimer:</strong> This article is for general information only. Medicare rules change
            regularly — always verify current requirements on{' '}
            <a href="https://www.mbsonline.gov.au" target="_blank" rel="noopener noreferrer" className="text-sage hover:underline">MBS Online</a>{' '}
            and consult Services Australia for billing advice specific to your practice.
          </p>
        </div>
      </div>
    </>
  );
}
