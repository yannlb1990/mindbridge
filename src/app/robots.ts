import type { MetadataRoute } from 'next';

const BASE = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/features/', '/compare/', '/for/', '/pricing', '/demo', '/privacy', '/terms'],
        disallow: ['/dashboard', '/clients', '/notes', '/sessions', '/schedule', '/api/', '/settings'],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
