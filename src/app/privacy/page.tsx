'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Back link */}
        <Link
          href="/auth/signup"
          className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to sign up
        </Link>

        <div className="bg-white rounded-2xl shadow-soft p-8 md:p-12 space-y-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-text-primary mb-2">
              Privacy Policy
            </h1>
            <p className="text-sm text-text-muted">Last updated: March 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">1. Overview</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              MindBridge is committed to protecting the privacy of clinicians and their clients in
              accordance with the <em>Privacy Act 1988</em> (Cth), the Australian Privacy Principles
              (APPs), and applicable state health privacy legislation. This policy explains what data we
              collect, how we use it, and your rights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">2. Information We Collect</h2>
            <p className="text-text-secondary text-sm leading-relaxed">We collect the following categories of information:</p>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1 ml-2">
              <li><strong>Account information:</strong> name, email address, professional registration details.</li>
              <li><strong>Client records:</strong> clinical notes, session information, mood data, and homework records entered by clinicians.</li>
              <li><strong>Usage data:</strong> page visits, feature usage, and error logs for service improvement.</li>
              <li><strong>Device information:</strong> browser type, IP address, and operating system.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">3. How We Use Your Information</h2>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1 ml-2">
              <li>To provide and improve the MindBridge platform.</li>
              <li>To process clinical data on behalf of clinicians (data processor role).</li>
              <li>To send account-related notifications and product updates (opt-out available).</li>
              <li>To comply with legal obligations including mandatory reporting requirements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">4. Health Information</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Clinical and health information is treated as sensitive personal information under the
              Privacy Act. This data is encrypted at rest and in transit. We do not sell, rent, or share
              health information with third parties except where required by law or with your explicit
              consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">5. Data Storage and Security</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              All data is stored on servers located in Australia. We use industry-standard encryption
              (TLS 1.3), role-based access controls, and regular security audits to protect your
              information. In the event of a data breach, we will notify affected users as required by
              the Notifiable Data Breaches scheme.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">6. Data Retention</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              Clinical records are retained for a minimum of 7 years from the last service date (or until
              a minor turns 25) in accordance with Australian health records legislation. Account data is
              deleted within 30 days of account closure upon request.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">7. Your Rights</h2>
            <p className="text-text-secondary text-sm leading-relaxed">Under Australian privacy law, you have the right to:</p>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1 ml-2">
              <li>Access the personal information we hold about you.</li>
              <li>Request correction of inaccurate information.</li>
              <li>Complain about a breach of the APPs to the Office of the Australian Information Commissioner (OAIC).</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">8. Cookies</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We use essential cookies to maintain your session and preferences. We do not use
              advertising or third-party tracking cookies. You can disable cookies in your browser
              settings, though this may affect functionality.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">9. Contact Us</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For privacy enquiries or to exercise your rights, contact our Privacy Officer at{' '}
              <a href="mailto:privacy@mindbridge.com.au" className="text-sage hover:underline">
                privacy@mindbridge.com.au
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-beige">
            <Link
              href="/terms"
              className="text-sm text-sage hover:underline"
            >
              Read our Terms of Service →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
