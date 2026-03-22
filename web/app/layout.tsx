import type { Metadata } from 'next';
import { Playfair_Display, Cormorant_Garamond, Source_Sans_3 } from 'next/font/google';
import { BASE_URL, orgSchema, appSchema } from '@/lib/seo';
import './globals.css';

// Display / heading font — used for font-display class
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

// Scripture / quote font — used for font-scripture class
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-scripture',
  display: 'swap',
});

// Body / UI font — used for font-sans class
const sourceSans = Source_Sans_3({
  subsets: ['latin'],
  weight: ['300', '400', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'LibratoAi — Weigh it with wisdom',
    template: '%s — LibratoAi',
  },
  description:
    'An AI-powered Christian Discernment Companion. From the Latin librato — to weigh, to balance, to ponder. Navigate life\'s hardest decisions with biblical wisdom.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    type: 'website',
    siteName: 'LibratoAi',
    title: 'LibratoAi — Weigh it with wisdom',
    description:
      'An AI-powered Christian Discernment Companion. Navigate life\'s hardest decisions with biblical wisdom.',
    url: BASE_URL,
    images: [
      {
        url: `${BASE_URL}/api/og`,
        width: 1200,
        height: 630,
        alt: 'LibratoAi — Weigh it with wisdom',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LibratoAi — Weigh it with wisdom',
    description:
      'An AI-powered Christian Discernment Companion. Navigate life\'s hardest decisions with biblical wisdom.',
    images: [`${BASE_URL}/api/og`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = [orgSchema(), appSchema()];

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${cormorant.variable} ${sourceSans.variable}`}
    >
      <body className="font-sans antialiased">
        {jsonLd.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
        {children}
      </body>
    </html>
  );
}
