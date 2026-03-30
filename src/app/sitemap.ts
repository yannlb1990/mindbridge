import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    // Core public pages
    { url: `${BASE}/auth/login`, lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/auth/signup`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/demo`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },

    // Pricing
    { url: `${BASE}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Feature pages
    { url: `${BASE}/features/ai-notes`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/features/mhtp-tracking`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/features/client-portal`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // For pages
    { url: `${BASE}/for/psychologists`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/for/counsellors`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Comparison pages
    { url: `${BASE}/compare/cliniko`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/compare/halaxy`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE}/compare/simplepractice`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // Trust & authority pages
    { url: `${BASE}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/security`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/changelog`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },

    // Blog / content
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/blog/mhtp-guide`, lastModified: now, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${BASE}/blog/better-access-2026`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },

    // For pages
    { url: `${BASE}/for/social-workers`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];
}
