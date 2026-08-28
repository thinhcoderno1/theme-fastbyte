import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/ui/Container';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogEmptyState, BlogErrorState } from '@/components/blog/BlogState';
import { Pagination } from '@/components/blog/Pagination';
import { absoluteSiteUrl } from '@/lib/env';
import { getAuthorBySlug, getPostsByAuthor } from '@/lib/wordpress/queries';

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const author = await getAuthorBySlug(slug);
    if (!author) return { title: 'Không tìm thấy tác giả', robots: { index: false, follow: false } };
    const url = absoluteSiteUrl(`/blog/tac-gia/${author.slug}/`);
    return { title: `Bài viết của ${author.name}`, description: author.description || `Các bài viết do ${author.name} biên soạn.`, alternates: { canonical: url }, openGraph: { url, type: 'profile' } };
  } catch {
    return { title: 'Tác giả blog', robots: { index: false, follow: false } };
  }
}

async function loadAuthorPage(slug: string, page: number) {
  try {
    const author = await getAuthorBySlug(slug);
    const posts = author ? await getPostsByAuthor(author.id, page, 9) : null;
    return { author, posts };
  } catch {
    return null;
  }
}

export default async function AuthorPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ page?: string }> }) {
  const [{ slug }, query] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(query.page) || 1);
  const result = await loadAuthorPage(slug, page);
  if (!result) return <Container className="py-16"><BlogErrorState /></Container>;
  if (!result.author || !result.posts) notFound();
  const { author, posts } = result;
  const avatar = author.avatar_urls?.['96'];
  return (
      <>
        <section className="border-b border-line bg-surface-blue py-12"><Container className="flex items-center gap-5">{avatar && <Image src={avatar} alt={`Ảnh đại diện ${author.name}`} width={80} height={80} className="rounded-full" />}<div><p className="text-sm font-bold uppercase tracking-wide text-brand-700">Tác giả</p><h1 className="mt-2">{author.name}</h1>{author.description && <p className="mt-3 max-w-3xl text-ink-600">{author.description}</p>}</div></Container></section>
        <Container className="py-12 md:py-16">{posts.data.length ? <BlogGrid posts={posts.data} /> : <BlogEmptyState message="Tác giả này chưa có bài viết được xuất bản." />}<Pagination currentPage={page} totalPages={posts.pagination.totalPages} basePath={`/blog/tac-gia/${author.slug}/`} /></Container>
    </>
  );
}
