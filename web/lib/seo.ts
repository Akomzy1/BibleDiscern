/** Shared SEO utilities — JSON-LD schemas, metadata helpers */

export const BASE_URL = 'https://librato.ai';
export const APP_STORE_URL = 'https://apps.apple.com/app/librato-ai/id_PLACEHOLDER';
export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.librato.ai';

export const SITE_NAME = 'LibratoAi';
export const DEFAULT_DESCRIPTION =
  'LibratoAi is an AI-powered Christian discernment companion that guides you through a structured 7-step biblical decision-making journey. Available on iOS and Android.';

/** Organization schema */
export function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LibratoAi',
    url: BASE_URL,
    logo: `${BASE_URL}/og-image.png`,
    sameAs: [],
    description: DEFAULT_DESCRIPTION,
  };
}

/** MobileApplication schema */
export function appSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'LibratoAi',
    operatingSystem: 'iOS, Android',
    applicationCategory: 'LifestyleApplication',
    offers: [
      { '@type': 'Offer', price: '0', priceCurrency: 'USD', name: 'Free' },
      { '@type': 'Offer', price: '4.99', priceCurrency: 'USD', name: 'Premium Monthly' },
      { '@type': 'Offer', price: '39.99', priceCurrency: 'USD', name: 'Premium Annual' },
    ],
    downloadUrl: [APP_STORE_URL, PLAY_STORE_URL],
    description: DEFAULT_DESCRIPTION,
    url: BASE_URL,
  };
}

/** BreadcrumbList schema */
export function breadcrumbSchema(crumbs: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: c.url.startsWith('http') ? c.url : `${BASE_URL}${c.url}`,
    })),
  };
}

/** Article schema for blog posts */
export function articleSchema(post: {
  title: string;
  description: string;
  slug: string;
  date: string;
  author?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    url: `${BASE_URL}/blog/${post.slug}`,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Organization',
      name: post.author ?? SITE_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: { '@type': 'ImageObject', url: `${BASE_URL}/og-image.png` },
    },
    image: `${BASE_URL}/api/og?title=${encodeURIComponent(post.title)}`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${BASE_URL}/blog/${post.slug}` },
  };
}

/** FAQPage schema */
export function faqSchema(items: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}
