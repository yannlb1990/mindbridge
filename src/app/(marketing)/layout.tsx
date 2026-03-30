import Link from 'next/link';

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Nav */}
      <header className="bg-white border-b border-beige sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-display font-bold text-xl text-text-primary">
            Mind<span className="text-sage">Bridge</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary">
            <Link href="/features/ai-notes" className="hover:text-text-primary transition-colors">AI Notes</Link>
            <Link href="/features/mhtp-tracking" className="hover:text-text-primary transition-colors">MHTP Tracking</Link>
            <Link href="/features/client-portal" className="hover:text-text-primary transition-colors">Client Portal</Link>
            <Link href="/for/psychologists" className="hover:text-text-primary transition-colors">For Psychologists</Link>
            <Link href="/for/counsellors" className="hover:text-text-primary transition-colors">For Counsellors</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </Link>
            <Link href="/auth/signup" className="btn-primary text-sm px-4 py-2 rounded-lg font-medium">
              Start free
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-white border-t border-beige mt-16">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
          <div>
            <p className="font-semibold text-text-primary mb-3">MindBridge</p>
            <p className="text-text-muted leading-relaxed">
              AI-powered practice management for Australian psychologists and counsellors.
            </p>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-3">Features</p>
            <ul className="space-y-2 text-text-secondary">
              <li><Link href="/features/ai-notes" className="hover:text-sage transition-colors">AI Clinical Notes</Link></li>
              <li><Link href="/features/mhtp-tracking" className="hover:text-sage transition-colors">MHTP Tracking</Link></li>
              <li><Link href="/features/client-portal" className="hover:text-sage transition-colors">Client Portal</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-3">Compare</p>
            <ul className="space-y-2 text-text-secondary">
              <li><Link href="/compare/cliniko" className="hover:text-sage transition-colors">vs Cliniko</Link></li>
              <li><Link href="/compare/halaxy" className="hover:text-sage transition-colors">vs Halaxy</Link></li>
              <li><Link href="/compare/simplepractice" className="hover:text-sage transition-colors">vs SimplePractice</Link></li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-text-primary mb-3">For Clinicians</p>
            <ul className="space-y-2 text-text-secondary">
              <li><Link href="/for/psychologists" className="hover:text-sage transition-colors">Psychologists</Link></li>
              <li><Link href="/for/counsellors" className="hover:text-sage transition-colors">Counsellors</Link></li>
              <li><Link href="/auth/signup" className="hover:text-sage transition-colors">Start Free Trial</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-beige py-4 text-center text-xs text-text-muted">
          © {new Date().getFullYear()} MindBridge · Built for Australian clinicians ·{' '}
          <Link href="/privacy" className="hover:text-sage transition-colors">Privacy</Link>{' '}
          ·{' '}
          <Link href="/terms" className="hover:text-sage transition-colors">Terms</Link>
        </div>
      </footer>
    </div>
  );
}
