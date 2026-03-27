import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { BLOG_POSTS, getPostBySlug, getAllSlugs } from '@/lib/blog';
import { BASE_URL, articleSchema, breadcrumbSchema } from '@/lib/seo';

interface Props {
  params: { slug: string };
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.seoTitle,
    description: post.metaDescription,
    alternates: { canonical: `${BASE_URL}/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.metaDescription,
      url: `${BASE_URL}/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      images: [
        {
          url: `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle,
      description: post.metaDescription,
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function BlogPostPage({ params }: Props) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  const jsonLd = [
    articleSchema({
      title: post.title,
      description: post.metaDescription,
      slug: post.slug,
      date: post.date,
    }),
    breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Blog', url: '/blog' },
      { name: post.title, url: `/blog/${post.slug}` },
    ]),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      {/* Hero */}
      <div className="bg-navy py-14">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 space-y-4">
          <div className="flex items-center gap-2">
            <Link href="/blog"
              className="text-xs text-cream/50 hover:text-gold transition-colors">
              ← Blog
            </Link>
            <span className="text-cream/30 text-xs">·</span>
            <span className="text-xs text-gold uppercase tracking-wider">{post.category}</span>
            <span className="text-cream/30 text-xs">·</span>
            <span className="text-xs text-cream/50">{post.readTime} min read</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-cream leading-snug">
            {post.title}
          </h1>
          <p className="text-cream/50 text-sm">{formatDate(post.date)} · BibleDiscern</p>
        </div>
      </div>

      {/* Article */}
      <article className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
        <div
          className="
            prose prose-lg max-w-none
            prose-headings:font-display prose-headings:text-navy
            prose-h2:text-2xl prose-h3:text-xl
            prose-p:text-text-medium prose-p:leading-relaxed
            prose-a:text-gold prose-a:no-underline hover:prose-a:underline
            prose-strong:text-navy
            prose-blockquote:border-l-gold prose-blockquote:bg-parchment prose-blockquote:py-1 prose-blockquote:rounded-r-lg
            prose-blockquote:font-scripture prose-blockquote:text-navy prose-blockquote:not-italic
            prose-ul:text-text-medium prose-li:text-text-medium
            prose-ol:text-text-medium
            [&_.lead]:text-lg [&_.lead]:text-text-dark [&_.lead]:font-medium [&_.lead]:leading-relaxed
          "
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      </article>

      {/* CTA */}
      <div className="bg-navy py-12 text-center">
        <div className="mx-auto max-w-lg px-4 sm:px-6 space-y-4">
          <div className="text-gold text-4xl">✝</div>
          <h2 className="font-display text-2xl text-cream">
            Ready to begin your discernment journey?
          </h2>
          <p className="text-cream/60 font-scripture italic">
            Weigh it with wisdom — free on iOS and Android.
          </p>
          <Link href="/pricing"
            className="inline-block px-6 py-3 rounded-full bg-gold text-navy font-bold text-sm hover:bg-gold-muted transition-colors">
            Download BibleDiscern Free
          </Link>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="py-14 bg-parchment">
          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <h2 className="font-display text-xl text-navy mb-6">More from BibleDiscern</h2>
            <div className="grid sm:grid-cols-3 gap-5">
              {relatedPosts.map((rp) => (
                <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group block">
                  <article className="bg-cream border border-border rounded-xl p-5 space-y-2 h-full hover:border-gold transition-colors">
                    <p className="text-xs text-gold uppercase tracking-wider">{rp.category}</p>
                    <h3 className="font-display text-base text-navy group-hover:text-gold transition-colors leading-snug">
                      {rp.title}
                    </h3>
                    <p className="text-xs text-text-light">{rp.readTime} min read</p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
