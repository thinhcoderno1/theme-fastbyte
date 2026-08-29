import type { MetadataRoute } from 'next';
import { absoluteSiteUrl, isIndexingAllowed } from '@/lib/env';
import { getCategories, getPosts } from '@/lib/wordpress/queries';
import staticPaths from '@/lib/generated-sitemap-routes.json';

export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!isIndexingAllowed()) return [];
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) => ({
    url: absoluteSiteUrl(path),
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : path === '/blog/' ? 0.9 : 0.6,
  }));
  try {
    const [firstPosts, firstCategories] = await Promise.all([getPosts({ perPage: 100 }), getCategories(1, 100)]);
    const remainingPostPages = Array.from(
      { length: Math.max(0, firstPosts.pagination.totalPages - 1) },
      (_, index) => index + 2,
    );
    const remainingCategoryPages = Array.from(
      { length: Math.max(0, firstCategories.pagination.totalPages - 1) },
      (_, index) => index + 2,
    );
    const [remainingPosts, remainingCategories] = await Promise.all([
      Promise.all(remainingPostPages.map((page) => getPosts({ page, perPage: 100 }))),
      Promise.all(remainingCategoryPages.map((page) => getCategories(page, 100))),
    ]);
    const posts = [firstPosts, ...remainingPosts].flatMap((result) => result.data);
    const categories = [firstCategories, ...remainingCategories].flatMap((result) => result.data);
    entries.push(
      ...posts.map((post) => ({ url: absoluteSiteUrl(`/blog/${post.slug}/`), lastModified: post.modified, changeFrequency: 'weekly' as const, priority: 0.8 })),
      ...categories.map((category) => ({ url: absoluteSiteUrl(`/blog/danh-muc/${category.slug}/`), changeFrequency: 'weekly' as const, priority: 0.7 })),
    );
  } catch {
    // Giữ sitemap cho các trang tĩnh khi WordPress tạm thời không phản hồi.
  }
  return entries;
}
