import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, isIndexingAllowed } from '@/lib/env';
import { getCategories, getSitemapPosts } from '@/lib/wordpress/queries';
import { getPostPath } from '@/lib/wordpress/urls';
import staticPaths from '@/lib/generated-sitemap-routes.json';

export const revalidate = 300;

const reservedTopLevelSlugs = new Set(
  staticPaths
    .map((path) => path.split('/').filter(Boolean)[0])
    .filter((slug): slug is string => Boolean(slug)),
);

function wordpressGmtToIso(value: string): string | undefined {
  const date = new Date(`${value}Z`);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingAllowed()) return [];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteSiteUrl(path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/blog/' ? 0.9 : 0.6,
  }));
  try {
    const [firstPosts, firstCategories] = await Promise.all([getSitemapPosts(1, 100), getCategories(1, 100)]);
    const remainingPostPages = Array.from(
      { length: Math.max(0, firstPosts.pagination.totalPages - 1) },
      (_, index) => index + 2,
    );
    const remainingCategoryPages = Array.from(
      { length: Math.max(0, firstCategories.pagination.totalPages - 1) },
      (_, index) => index + 2,
    );
    const [remainingPosts, remainingCategories] = await Promise.all([
      Promise.all(remainingPostPages.map((page) => getSitemapPosts(page, 100))),
      Promise.all(remainingCategoryPages.map((page) => getCategories(page, 100))),
    ]);
    const posts = [firstPosts, ...remainingPosts].flatMap((result) => result.data);
    const categories = [firstCategories, ...remainingCategories].flatMap((result) => result.data);
    const routablePosts = posts.filter((post) => !reservedTopLevelSlugs.has(post.slug));
    entries.push(
      ...routablePosts.map((post) => ({ url: absoluteSiteUrl(getPostPath(post.slug)), lastModified: wordpressGmtToIso(post.modified_gmt), changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...categories.map((category) => ({ url: absoluteSiteUrl(`/blog/danh-muc/${category.slug}/`), changeFrequency: 'weekly' as const, priority: 0.7 })),
    );
  } catch {
    // Giữ sitemap cho các trang tĩnh khi WordPress tạm thời không phản hồi.
  }
  return entries;
}
