import type { MetadataRoute } from 'next';
import { source, blogSource } from '@/lib/source';
import { SITE_URL } from '@/lib/seo';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/docs`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/changelog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contributors`, changeFrequency: 'weekly', priority: 0.5 },
  ];

  const docs: MetadataRoute.Sitemap = source.getPages().map((p) => ({
    url: `${SITE_URL}${p.url}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blog: MetadataRoute.Sitemap = blogSource.getPages().map((p) => ({
    url: `${SITE_URL}${p.url}`,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...docs, ...blog];
}
