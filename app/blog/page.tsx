import type { Metadata } from 'next';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { BlogCard } from '@/components/blog/BlogCard';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogEmptyState, BlogErrorState } from '@/components/blog/BlogState';
import { Pagination } from '@/components/blog/Pagination';
import { absoluteSiteUrl } from '@/lib/env';
import { getCategories, getFeaturedPosts, getPosts } from '@/lib/wordpress/queries';
import { decodeTitle } from '@/lib/wordpress/utils';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Blog kiến thức VPS và máy chủ',
  description: 'Kiến thức thực tế về VPS, máy chủ, bảo mật, vận hành website và tối ưu hiệu năng.',
  alternates: { canonical: absoluteSiteUrl('/blog/') },
  openGraph: { url: absoluteSiteUrl('/blog/'), type: 'website' },
};

async function loadBlogPage(page: number) {
  try {
    const [postsResult, featuredPosts, categoriesResult] = await Promise.all([
      getPosts({ page, perPage: 9 }),
      page === 1 ? getFeaturedPosts(1) : Promise.resolve([]),
      getCategories(1, 20),
    ]);
    return { postsResult, featuredPosts, categoriesResult };
  } catch {
    return null;
  }
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const query = await searchParams;
  const page = Math.max(1, Number(query.page) || 1);
  const result = await loadBlogPage(page);
  if (!result) {
    return (
      <>
        <section className="border-b border-line bg-surface-blue py-12 md:py-16">
          <Container>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Kiến thức Fast Byte</p>
            <h1 className="mt-3">Blog VPS và hạ tầng máy chủ</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-600">Hướng dẫn, kinh nghiệm vận hành và kiến thức kỹ thuật giúp bạn sử dụng VPS an toàn, ổn định và hiệu quả hơn.</p>
          </Container>
        </section>
        <Container className="py-16"><BlogErrorState /></Container>
      </>
    );
  }
  const { postsResult, featuredPosts, categoriesResult } = result;
  const featured = featuredPosts[0];
  const posts = featured ? postsResult.data.filter((post) => post.id !== featured.id) : postsResult.data;

  return (
      <>
        <section className="border-b border-line bg-surface-blue py-12 md:py-16">
          <Container>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Kiến thức Fast Byte</p>
            <h1 className="mt-3">Blog VPS và hạ tầng máy chủ</h1>
            <p className="mt-4 max-w-3xl text-base leading-8 text-ink-600">Hướng dẫn, kinh nghiệm vận hành và kiến thức kỹ thuật giúp bạn sử dụng VPS an toàn, ổn định và hiệu quả hơn.</p>
            {categoriesResult.data.length > 0 && (
              <nav className="mt-6 flex flex-wrap gap-2" aria-label="Danh mục blog">
                {categoriesResult.data.map((category) => (
                  <Link key={category.id} href={`/blog/danh-muc/${category.slug}/`} className="rounded-pill border border-brand-100 bg-white px-3.5 py-2 text-sm font-semibold text-brand-700 hover:border-brand-300">
                    {decodeTitle(category.name)} <span className="text-ink-400">({category.count})</span>
                  </Link>
                ))}
              </nav>
            )}
          </Container>
        </section>
        <Container className="py-12 md:py-16">
          {featured && page === 1 && (
            <section aria-labelledby="featured-heading" className="mb-14">
              <h2 id="featured-heading" className="mb-6 text-2xl">Bài viết nổi bật</h2>
              <BlogCard post={featured} featured />
            </section>
          )}
          <section aria-labelledby="latest-heading">
            <h2 id="latest-heading" className="mb-6 text-2xl">{page > 1 ? `Bài viết mới — Trang ${page}` : 'Bài viết mới nhất'}</h2>
            {posts.length ? <BlogGrid posts={posts} /> : <BlogEmptyState />}
            <Pagination currentPage={page} totalPages={postsResult.pagination.totalPages} basePath="/blog/" />
          </section>
        </Container>
    </>
  );
}
