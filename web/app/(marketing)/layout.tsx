import type { Metadata } from 'next';
import { BASE_URL } from '@/lib/seo';
import { SiteNav, SiteFooter } from '@/components/site/Site';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'BibleDiscern — Weigh it with wisdom', template: '%s | BibleDiscern' },
  description:
    'BibleDiscern guides Christians through a structured 7-step biblical discernment journey. Rooted in Scripture.',
  openGraph: {
    siteName: 'BibleDiscern',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

// The marketing site reads like a nave: navy ground, single content column.
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-nave-900 font-body text-vellum-100 antialiased">
      <SiteNav />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}
