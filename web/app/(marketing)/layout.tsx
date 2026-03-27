import type { Metadata } from 'next';
import Link from 'next/link';
import { APP_STORE_URL, BASE_URL, PLAY_STORE_URL } from '@/lib/seo';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: { default: 'BibleDiscern — Weigh it with wisdom', template: '%s | BibleDiscern' },
  description:
    'BibleDiscern guides Christians through a structured 7-step biblical discernment journey. Powered by AI. Rooted in Scripture.',
  openGraph: {
    siteName: 'BibleDiscern',
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image' },
};

const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/pricing', label: 'Pricing' },
];

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-cream font-sans text-text-dark antialiased">
      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl">✝</span>
            <span className="font-display text-xl text-navy font-bold tracking-wide">
              BibleDiscern
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-text-medium hover:text-navy transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={APP_STORE_URL}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-navy text-cream text-sm font-semibold hover:bg-navy-light transition-colors"
            >
              Download Free
            </a>
          </div>
        </div>
      </header>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      <main>{children}</main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-navy text-cream/70 mt-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-gold text-xl">✝</span>
              <span className="font-display text-lg text-cream">BibleDiscern</span>
            </div>
            <p className="text-sm leading-relaxed text-cream/60 italic font-scripture">
              "Weigh it with wisdom."
            </p>
            <p className="text-xs text-cream/40">
              From the Latin <em>librato</em> — to weigh, to balance, to ponder.
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
              Links
            </p>
            <ul className="space-y-2">
              {[
                ['/', 'Home'],
                ['/about', 'About'],
                ['/pricing', 'Pricing'],
                ['/blog', 'Blog'],
                ['/privacy', 'Privacy Policy'],
                ['/terms', 'Terms of Service'],
              ].map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-cream/60 hover:text-gold transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Download */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-4">
              Download
            </p>
            <div className="space-y-3">
              <a
                href={APP_STORE_URL}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream/20 hover:border-gold transition-colors text-sm text-cream"
              >
                <span>🍎</span> App Store — iOS
              </a>
              <a
                href={PLAY_STORE_URL}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-cream/20 hover:border-gold transition-colors text-sm text-cream"
              >
                <span>🤖</span> Google Play — Android
              </a>
            </div>
            <p className="mt-4 text-xs text-cream/40">
              support@librato.ai
            </p>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-cream/30">
            <span>© 2026 BibleDiscern — Made with reverence.</span>
            <span className="italic font-scripture">
              "If any of you lacks wisdom, let him ask God." — James 1:5
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
