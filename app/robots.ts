import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, isIndexingAllowed } from '@/lib/env';

export default function robots(): MetadataRoute.Robots {
  const allowIndexing = isIndexingAllowed();
  return {
    rules: allowIndexing
      ? { userAgent: '*', allow: '/', disallow: ['/api/'] }
      : { userAgent: '*', disallow: '/' },
    sitemap: allowIndexing ? absoluteSiteUrl('/sitemap.xml') : undefined,
    host: allowIndexing ? absoluteSiteUrl('/') : undefined,
  };
}
