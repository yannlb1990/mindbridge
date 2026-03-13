'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
              Terms of Service
            </h1>
            <p className="text-sm text-text-muted">Last updated: March 2026</p>
          </div>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">1. Acceptance of Terms</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              By accessing or using MindBridge ("the Service"), you agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use the Service. MindBridge is
              intended for use by qualified mental health professionals and their clients in Australia.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">2. Use of the Service</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              MindBridge is a clinical practice management platform designed to support mental health
              clinicians. The Service must only be used in compliance with applicable Australian laws,
              including the Privacy Act 1988, the Health Records and Information Privacy Act 2002 (NSW),
              and relevant state health legislation.
            </p>
            <ul className="list-disc list-inside text-text-secondary text-sm space-y-1 ml-2">
              <li>You must be a registered mental health professional to create a clinician account.</li>
              <li>Client accounts must only be created with the informed consent of the client (or guardian).</li>
              <li>You are responsible for the accuracy of all clinical information entered.</li>
              <li>You must not share account credentials with any third party.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">3. Clinical Responsibility</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              MindBridge is a support tool and does not replace professional clinical judgment. Any
              AI-generated content, suggestions, or assessments are informational only and must be
              reviewed and verified by a qualified clinician before use. MindBridge accepts no liability
              for clinical decisions made based on information within the platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">4. Intellectual Property</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              All content, features, and functionality of MindBridge are the exclusive property of
              MindBridge and its licensors. You retain ownership of clinical data you input. By using the
              Service, you grant MindBridge a limited licence to process your data solely to provide the
              Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">5. Limitation of Liability</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              To the maximum extent permitted by Australian Consumer Law, MindBridge is provided "as is"
              without warranties of any kind. We are not liable for any indirect, incidental, or
              consequential damages arising from your use of the Service.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">6. Termination</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              We reserve the right to suspend or terminate your account if you breach these Terms. You
              may cancel your account at any time. Upon termination, your access to the Service will cease
              and data will be retained or deleted in accordance with our Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">7. Governing Law</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              These Terms are governed by the laws of Queensland, Australia. Any disputes will be subject
              to the exclusive jurisdiction of Queensland courts.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-text-primary">8. Contact</h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              For questions about these Terms, please contact us at{' '}
              <a href="mailto:legal@mindbridge.com.au" className="text-sage hover:underline">
                legal@mindbridge.com.au
              </a>
              .
            </p>
          </section>

          <div className="pt-4 border-t border-beige">
            <Link
              href="/privacy"
              className="text-sm text-sage hover:underline"
            >
              Read our Privacy Policy →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
