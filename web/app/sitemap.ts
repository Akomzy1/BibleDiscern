import type { MetadataRoute } from 'next';
import { BASE_URL } from '@/lib/seo';
import { getAllSlugs } from '@/lib/blog';
import { listAllScaleSlugs } from '@/lib/scales';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/pricing`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${BASE_URL}/scale`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
    { url: `${BASE_URL}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/privacy`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const blogPages: MetadataRoute.Sitemap = getAllSlugs().map((slug) => ({
    url: `${BASE_URL}/blog/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  // Every published Daily Scale becomes an indexed page (+1 daily)
  let scalePages: MetadataRoute.Sitemap = [];
  try {
    const scales = await listAllScaleSlugs();
    scalePages = scales
      .filter((s) => s.slug)
      .map((s) => ({
        url: `${BASE_URL}/scale/${s.slug}`,
        lastModified: `${s.date}T00:00:00.000Z`,
        changeFrequency: 'yearly' as const,
        priority: 0.7,
      }));
  } catch {
    // archive unavailable at generation time — static pages still emit
  }

  return [...staticPages, ...blogPages, ...scalePages];
}
