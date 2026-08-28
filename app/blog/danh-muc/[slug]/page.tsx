import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogEmptyState, BlogErrorState } from '@/components/blog/BlogState';
import { Pagination } from '@/components/blog/Pagination';
import { absoluteSiteUrl } from '@/lib/env';
import { getCategoryBySlug, getPostsByCategory } from '@/lib/wordpress/queries';
import { decodeTitle, stripHtml } from '@/lib/wordpress/utils';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const category = await getCategoryBySlug(slug);
    if (!category) return { title: 'Không tìm thấy danh mục', robots: { index: false, follow: false } };
    const url = absoluteSiteUrl(`/blog/danh-muc/${category.slug}/`);
    const categoryName = decodeTitle(category.name);
    const categoryDescription = stripHtml(category.description) || `Bài viết thuộc danh mục ${categoryName}.`;
    return {
      title: `${categoryName} - Blog`,
      description: categoryDescription,
      alternates: { canonical: url },
      openGraph: { title: `${categoryName} - Blog`, description: categoryDescription, url, type: 'website' },
    };
  } catch {
    return { title: 'Danh mục blog', robots: { index: false, follow: false } };
  }
}

async function loadCategoryPage(slug: string, page: number) {
  try {
    const category = await getCategoryBySlug(slug);
    const posts = category ? await getPostsByCategory(category.id, page, 9) : null;
    return { category, posts };
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(query.page) || 1);
  const result = await loadCategoryPage(slug, page);
  if (!result) return <Container className="py-16"><BlogErrorState /></Container>;
  if (!result.category || !result.posts) notFound();
  const { category, posts } = result;
  const categoryName = decodeTitle(category.name);
  const categoryDescription = stripHtml(category.description);
  return (
      <>
        <section className="border-b border-line bg-surface-blue py-12"><Container><p className="text-sm font-bold uppercase tracking-wide text-brand-700">Danh mục blog</p><h1 className="mt-3">{categoryName}</h1>{categoryDescription && <p className="mt-4 max-w-3xl text-ink-600">{categoryDescription}</p>}</Container></section>
        <Container className="py-12 md:py-16">
          {posts.data.length ? <BlogGrid posts={posts.data} /> : <BlogEmptyState message="Danh mục này chưa có bài viết được xuất bản." />}
          <Pagination currentPage={page} totalPages={posts.pagination.totalPages} basePath={`/blog/danh-muc/${category.slug}/`} />
        </Container>
    </>
  );
}
