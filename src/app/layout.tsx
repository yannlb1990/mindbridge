import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import ThemeProvider from '@/components/ThemeProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://mindbridge.com.au';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'MindBridge — Practice Management Software for Australian Psychologists',
    template: '%s | MindBridge',
  },
  description:
    'MindBridge is an AI-powered practice management platform built for Australian psychologists and counsellors. SOAP/DAP/BIRP note generation, MHTP session tracking, age-adaptive client portal, Medicare billing. Free to try.',
  keywords: [
    'practice management software psychologists Australia',
    'AI note taking psychologist',
    'MHTP session tracking',
    'psychology software Australia',
    'mental health practice management',
    'clinical notes software',
    'telehealth psychology platform',
    'AHPRA compliant software',
    'Better Access software',
    'counselling practice management',
  ],
  authors: [{ name: 'MindBridge', url: APP_URL }],
  creator: 'MindBridge',
  publisher: 'MindBridge',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: APP_URL,
    siteName: 'MindBridge',
    title: 'MindBridge — AI-Powered Practice Management for Australian Psychologists',
    description:
      'The only practice management platform with built-in AI note generation, MHTP session tracking, and an age-adaptive client portal. Built for Australian clinicians.',
    images: [
      {
        url: `${APP_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'MindBridge — Practice Management for Psychologists',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MindBridge — AI-Powered Practice Management for Australian Psychologists',
    description:
      'AI note generation, MHTP tracking, telehealth, and an age-adaptive client portal. Built for Australian clinicians.',
    images: [`${APP_URL}/og-image.png`],
  },
  alternates: {
    canonical: APP_URL,
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || '',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${plusJakarta.variable}`}>
      <head>
        {/* Apply stored theme/accent before first paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var s = JSON.parse(localStorage.getItem('mindbridge-appearance') || '{}');
                var t = (s.state && s.state.theme) || 'light';
                var resolved = t === 'system'
                  ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
                  : t;
                document.documentElement.setAttribute('data-theme', resolved);
                var accent = (s.state && s.state.accentColor) || 'sage';
                document.documentElement.setAttribute('data-accent', accent);
              } catch(e) {}
            `,
          }}
        />
        {/* SoftwareApplication structured data — helps LLMs and Google understand what MindBridge is */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'MindBridge',
              url: APP_URL,
              applicationCategory: 'HealthApplication',
              operatingSystem: 'Web',
              description:
                'AI-powered practice management platform for Australian psychologists and mental health clinicians. Features AI note generation (SOAP/DAP/BIRP), MHTP session tracking, Medicare billing, age-adaptive client portal, and telehealth integration.',
              offers: {
                '@type': 'Offer',
                priceCurrency: 'AUD',
                price: '0',
                description: 'Free trial available',
              },
              audience: {
                '@type': 'MedicalAudience',
                audienceType: 'Psychologist, Counsellor, Social Worker, Mental Health Clinician',
              },
              areaServed: {
                '@type': 'Country',
                name: 'Australia',
              },
              featureList: [
                'AI clinical note generation (SOAP, DAP, BIRP, Narrative)',
                'MHTP Better Access session tracking',
                'Medicare billing and item numbers',
                'Age-adaptive client portal (child, teen, adult)',
                'Telehealth session management',
                'Standardised outcome measures (PHQ-9, GAD-7, K10, DASS-21)',
                'Safety plan management',
                'Homework assignment and tracking',
                'Secure clinician-client messaging',
                'AHPRA-compliant data handling',
              ],
              provider: {
                '@type': 'Organization',
                name: 'MindBridge',
                url: APP_URL,
                areaServed: 'Australia',
              },
            }),
          }}
        />
      </head>
      <body className="font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
