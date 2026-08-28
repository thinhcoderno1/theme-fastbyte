import type { Metadata } from 'next';
import { Search } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogEmptyState, BlogErrorState } from '@/components/blog/BlogState';
import { Pagination } from '@/components/blog/Pagination';
import { absoluteSiteUrl, isIndexingAllowed } from '@/lib/env';
import { searchPosts } from '@/lib/wordpress/queries';

export const metadata: Metadata = {
  title: 'Tìm kiếm bài viết',
  alternates: { canonical: absoluteSiteUrl('/blog/tim-kiem/') },
  robots: { index: false, follow: isIndexingAllowed() },
};

async function loadSearchResults(query: string, page: number) {
  try {
    return await searchPosts(query, page, 9);
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; page?: string }> }) {
  const params = await searchParams;
  const query = (params.q || '').trim().slice(0, 100);
  const page = Math.max(1, Number(params.page) || 1);
  let content: React.ReactNode = <BlogEmptyState message="Nhập từ khóa để tìm trong blog." />;
  if (query) {
    const posts = await loadSearchResults(query, page);
    content = posts
      ? posts.data.length
        ? <><BlogGrid posts={posts.data} /><Pagination currentPage={page} totalPages={posts.pagination.totalPages} basePath="/blog/tim-kiem/" query={{ q: query }} /></>
        : <BlogEmptyState message={`Không tìm thấy bài viết phù hợp với “${query}”.`} />
      : <BlogErrorState />;
  }
  return (
    <><section className="border-b border-line bg-surface-blue py-12"><Container><h1>Tìm kiếm bài viết</h1><form action="/blog/tim-kiem/" method="get" className="mt-6 flex max-w-2xl gap-2"><label htmlFor="blog-search" className="sr-only">Từ khóa tìm kiếm</label><input id="blog-search" name="q" defaultValue={query} maxLength={100} placeholder="Ví dụ: cài đặt VPS..." className="h-12 min-w-0 flex-1 rounded-md border border-line-strong bg-white px-4 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100" /><button className="inline-flex h-12 items-center gap-2 rounded-md bg-brand-700 px-5 font-semibold text-white hover:bg-brand-800" type="submit"><Search size={18} /> Tìm</button></form></Container></section><Container className="py-12 md:py-16">{query && <p className="mb-6 text-sm text-ink-600">Kết quả cho: <strong className="text-ink-900">{query}</strong></p>}{content}</Container></>
  );
}
