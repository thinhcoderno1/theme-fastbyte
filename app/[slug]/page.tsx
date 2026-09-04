import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, CalendarDays, Clock3, RefreshCw, UserRound } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { BlogGrid } from '@/components/blog/BlogGrid';
import { BlogErrorState } from '@/components/blog/BlogState';
import { BlogImage } from '@/components/blog/BlogImage';
import { ShareButtons } from '@/components/blog/ShareButtons';
import { TableOfContents } from '@/components/blog/TableOfContents';
import { WordPressContent } from '@/components/blog/WordPressContent';
import { absoluteSiteUrl } from '@/lib/env';
import { getPostBySlug, getRelatedPosts } from '@/lib/wordpress/queries';
import { getPostMetaDescription } from '@/lib/wordpress/seo';
import { getPostPath } from '@/lib/wordpress/urls';
import {
  decodeTitle,
  estimateReadingTime,
  formatPostDate,
  getBestImage,
  getFeaturedMedia,
  getPostAuthor,
  getPostTerms,
  prepareWordPressContent,
  stripHtml,
} from '@/lib/wordpress/utils';

export const revalidate = 300;

const SHOW_POST_FEATURED_IMAGE = false;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    if (!post) return { title: 'Không tìm thấy bài viết', robots: { index: false, follow: false } };
    const title = decodeTitle(post.title.rendered);
    const description = await getPostMetaDescription(post)
      || stripHtml(post.excerpt.rendered).slice(0, 160);
    const url = absoluteSiteUrl(getPostPath(post.slug));
    const image = getBestImage(getFeaturedMedia(post));
    const author = getPostAuthor(post);
    const terms = getPostTerms(post);
    const categoryName = terms.categories[0] ? decodeTitle(terms.categories[0].name) : undefined;
    const tagNames = terms.tags.map((tag) => decodeTitle(tag.name));
    return {
      title,
      description,
      authors: author ? [{ name: author.name }] : undefined,
      keywords: tagNames,
      alternates: { canonical: url },
      openGraph: {
        type: 'article', url, title, description,
        publishedTime: post.date, modifiedTime: post.modified,
        authors: author ? [author.name] : undefined,
        section: categoryName,
        tags: tagNames,
        images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt || title }] : undefined,
      },
      twitter: { card: 'summary_large_image', title, description, images: image ? [image.url] : undefined },
    };
  } catch {
    return { title: 'Bài viết', robots: { index: false, follow: false } };
  }
}

async function loadPostPage(slug: string) {
  try {
    const post = await getPostBySlug(slug);
    const related = post ? await getRelatedPosts(post, 3) : [];
    return { post, related };
  } catch {
    return null;
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const result = await loadPostPage(slug);
  if (!result) return <Container className="py-16"><BlogErrorState /></Container>;
  if (!result.post) notFound();
  const { post, related } = result;
  const title = decodeTitle(post.title.rendered);
  const excerpt = stripHtml(post.excerpt.rendered);
  const seoDescription = await getPostMetaDescription(post);
  const author = getPostAuthor(post);
  const terms = getPostTerms(post);
  const prepared = prepareWordPressContent(post.content.rendered);
  const postUrl = absoluteSiteUrl(getPostPath(post.slug));
  const featuredImage = getBestImage(getFeaturedMedia(post));
  const category = terms.categories[0];
  const categoryName = category ? decodeTitle(category.name) : undefined;
  const tagNames = terms.tags.map((tag) => decodeTitle(tag.name));
  const articleSchema = {
    '@context': 'https://schema.org', '@type': 'BlogPosting', headline: title,
    description: seoDescription || excerpt, image: featuredImage?.url, datePublished: post.date, dateModified: post.modified,
    mainEntityOfPage: postUrl, author: author ? { '@type': 'Person', name: author.name } : undefined,
    publisher: { '@type': 'Organization', name: 'Fast Byte' }, articleSection: categoryName,
    keywords: tagNames.join(', '),
  };
  const breadcrumbSchema = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: absoluteSiteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: absoluteSiteUrl('/blog/') },
      { '@type': 'ListItem', position: 3, name: title, item: postUrl },
    ],
  };
  const safeSchema = JSON.stringify([articleSchema, breadcrumbSchema]).replace(/</g, '\\u003c');

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeSchema }} />
      <article>
        <header className="border-b border-line bg-surface-blue py-10 md:py-14">
          <Container className="max-w-[960px]">
            <nav className="mb-5 flex flex-wrap gap-2 text-sm text-ink-500" aria-label="Breadcrumb"><Link href="/" className="hover:text-brand-700">Trang chủ</Link><span>/</span><Link href="/blog/" className="hover:text-brand-700">Blog</Link>{category && <><span>/</span><Link href={`/blog/danh-muc/${category.slug}/`} className="hover:text-brand-700">{categoryName}</Link></>}</nav>
            {category && <Link href={`/blog/danh-muc/${category.slug}/`} className="text-sm font-bold uppercase tracking-wide text-brand-700">{categoryName}</Link>}
            <h1 className="mt-3 text-balance">{title}</h1>
            {excerpt && <p className="mt-5 text-lg leading-8 text-ink-600">{excerpt}</p>}
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-3 text-sm text-ink-600">
              {author && <Link href={`/blog/tac-gia/${author.slug}/`} className="inline-flex items-center gap-2 font-semibold hover:text-brand-700">{author.avatar_urls?.['48'] ? <Image src={author.avatar_urls['48']} alt={`Ảnh đại diện ${author.name}`} width={28} height={28} className="rounded-full" /> : <UserRound size={17} />}{author.name}</Link>}
              <time dateTime={post.date} className="inline-flex items-center gap-1.5"><CalendarDays size={16} />Đăng {formatPostDate(post.date)}</time>
              <time dateTime={post.modified} className="inline-flex items-center gap-1.5"><RefreshCw size={16} />Cập nhật {formatPostDate(post.modified)}</time>
              <span className="inline-flex items-center gap-1.5"><Clock3 size={16} />{estimateReadingTime(post.content.rendered)} phút đọc</span>
            </div>
          </Container>
        </header>
        <Container className="max-w-[1080px] py-10 md:py-14">
          {SHOW_POST_FEATURED_IMAGE && <div className="aspect-[16/9] overflow-hidden rounded-xl border border-line bg-surface-subtle"><BlogImage post={post} priority sizes="(max-width: 1080px) 100vw, 1080px" /></div>}
          <div className={`${SHOW_POST_FEATURED_IMAGE ? 'mt-10 ' : ''}grid gap-10 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-start`}>
            <aside className="lg:sticky lg:top-24"><TableOfContents headings={prepared.headings} /></aside>
            <div className="min-w-0"><WordPressContent html={prepared.html} /><div className="mt-10 border-t border-line pt-6"><ShareButtons url={postUrl} title={title} /></div>{terms.tags.length > 0 && <div className="mt-6 flex flex-wrap gap-2"><span className="text-sm font-semibold text-ink-700">Thẻ:</span>{terms.tags.map((tag) => <span key={tag.id} className="rounded-pill bg-surface-subtle px-3 py-1 text-xs text-ink-600">#{decodeTitle(tag.name)}</span>)}</div>}<Link href="/blog/" className="mt-8 inline-flex items-center gap-2 font-semibold text-brand-700 hover:text-brand-900"><ArrowLeft size={17} /> Quay lại trang blog</Link></div>
          </div>
        </Container>
      </article>
      {related.length > 0 && <section className="border-t border-line bg-surface-subtle py-12 md:py-16"><Container><h2 className="mb-7 text-2xl">Bài viết liên quan</h2><BlogGrid posts={related} /></Container></section>}
    </>
  );
}
