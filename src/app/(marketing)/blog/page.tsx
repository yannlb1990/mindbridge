import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog — Resources for Australian Psychologists & Mental Health Clinicians | MindBridge',
  description: 'Practical guides for Australian psychologists, counsellors, and social workers. MHTP Better Access, Medicare billing, AI in clinical practice, and practice management.',
  alternates: { canonical: 'https://mindbridge.com.au/blog' },
};

const posts = [
  {
    slug: 'mhtp-guide',
    title: 'The Complete Guide to MHTP Better Access Sessions in 2026',
    description: 'Everything Australian psychologists need to know about Mental Health Treatment Plans — session limits, referral requirements, Medicare item numbers, and how to track it all.',
    date: 'March 2026',
    readTime: '8 min read',
    tag: 'Medicare & Billing',
  },
  {
    slug: 'better-access-2026',
    title: 'Better Access in 2026: What Changed and What It Means for Your Practice',
    description: 'A summary of recent Better Access initiative changes, the current session limits, and what Australian psychologists need to update in their practice workflows.',
    date: 'February 2026',
    readTime: '6 min read',
    tag: 'Policy',
  },
];

export default function BlogPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-sm font-medium text-sage uppercase tracking-wide mb-3">Blog</p>
        <h1 className="text-4xl font-display font-bold text-text-primary mb-4">Resources for clinicians</h1>
        <p className="text-text-secondary">Practical guides for Australian psychologists, counsellors, and social workers.</p>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`}>
            <div className="bg-white rounded-2xl shadow-soft p-7 hover:shadow-lg transition-all hover:border-sage/30 border border-transparent">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-sage/10 text-sage px-2.5 py-1 rounded-full">{post.tag}</span>
                <span className="text-xs text-text-muted">{post.date}</span>
                <span className="text-xs text-text-muted">·</span>
                <span className="text-xs text-text-muted">{post.readTime}</span>
              </div>
              <h2 className="text-xl font-display font-bold text-text-primary mb-2 group-hover:text-sage">{post.title}</h2>
              <p className="text-text-secondary text-sm leading-relaxed">{post.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
