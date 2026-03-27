import type { Metadata } from 'next';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blog';
import { BASE_URL, breadcrumbSchema } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Blog — BibleDiscern',
  description:
    'Biblical discernment guides, Scripture-based decision-making resources, and reflections on Christian spiritual formation from the BibleDiscern team.',
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'BibleDiscern Blog — Biblical Discernment Resources',
    url: `${BASE_URL}/blog`,
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  'Discernment': 'bg-navy/10 text-navy',
  'Scripture': 'bg-gold/20 text-text-dark',
  'Spiritual Growth': 'bg-sage/20 text-sage',
  'Faith & Technology': 'bg-navy/10 text-navy',
  'Prayer': 'bg-gold/10 text-gold',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

export default function BlogIndexPage() {
  const crumbs = breadcrumbSchema([
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
  ]);

  const [featured, ...rest] = BLOG_POSTS;

  return (
    <>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(crumbs) }} />

      {/* Header */}
      <section className="bg-navy py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6 space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Resources
          </p>
          <h1 className="font-display text-4xl text-cream">
            Biblical Discernment Resources
          </h1>
          <p className="text-cream/60">
            Guides, reflections, and deep dives into the practice of seeking God&apos;s wisdom.
          </p>
        </div>
      </section>

      <section className="py-14 bg-cream">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 space-y-10">
          {/* Featured post */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="group block">
              <article className="bg-parchment border border-border rounded-2xl overflow-hidden hover:border-gold transition-colors">
                <div className="p-8 sm:p-10 space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${CATEGORY_COLORS[featured.category] ?? 'bg-border text-text-medium'}`}>
                      {featured.category}
                    </span>
                    <span className="text-xs text-text-light">
                      {featured.readTime} min read
                    </span>
                  </div>
                  <h2 className="font-display text-2xl sm:text-3xl text-navy group-hover:text-gold transition-colors leading-snug">
                    {featured.title}
                  </h2>
                  <p className="text-text-medium leading-relaxed max-w-2xl">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gold font-semibold">
                    Read article <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                  </div>
                </div>
              </article>
            </Link>
          )}

          {/* Other posts */}
          <div className="grid sm:grid-cols-2 gap-6">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="h-full bg-parchment border border-border rounded-xl p-6 space-y-3 hover:border-gold transition-colors">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${CATEGORY_COLORS[post.category] ?? 'bg-border text-text-medium'}`}>
                      {post.category}
                    </span>
                    <span className="text-xs text-text-light">{post.readTime} min</span>
                  </div>
                  <h2 className="font-display text-lg text-navy group-hover:text-gold transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-sm text-text-medium leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                  <p className="text-xs text-text-light">{formatDate(post.date)}</p>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
