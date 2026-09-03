import Link from 'next/link';
import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import type { WordPressPost } from '@/lib/wordpress/types';
import { getPostPath } from '@/lib/wordpress/urls';
import {
  decodeTitle,
  formatPostDate,
  getPostAuthor,
  getPostTerms,
  stripHtml,
} from '@/lib/wordpress/utils';
import { BlogImage } from './BlogImage';

export function BlogCard({ post, featured = false }: { post: WordPressPost; featured?: boolean }) {
  const author = getPostAuthor(post);
  const category = getPostTerms(post).categories[0];
  const excerpt = stripHtml(post.excerpt.rendered);
  const postPath = getPostPath(post.slug);

  return (
    <article className={`group overflow-hidden rounded-xl border border-line bg-white shadow-sm ${featured ? 'md:grid md:grid-cols-2' : ''}`}>
      <Link href={postPath} className={`block overflow-hidden bg-surface-blue ${featured ? 'min-h-64' : 'aspect-[16/9]'}`}>
        <BlogImage
          post={post}
          priority={featured}
          sizes={featured ? '(max-width: 768px) 100vw, 600px' : '(max-width: 768px) 100vw, 380px'}
          className="transition-transform duration-300 group-hover:scale-[1.02]"
        />
      </Link>
      <div className={`flex flex-col ${featured ? 'p-7 lg:p-9' : 'p-5'}`}>
        {category && (
          <Link href={`/blog/danh-muc/${category.slug}/`} className="mb-3 w-fit text-xs font-bold uppercase tracking-wide text-brand-700 hover:text-brand-900">
            {decodeTitle(category.name)}
          </Link>
        )}
        <h2 className={`${featured ? 'text-2xl lg:text-3xl' : 'text-xl'} leading-snug`}>
          <Link href={postPath} className="transition-colors hover:text-brand-700">
            {decodeTitle(post.title.rendered)}
          </Link>
        </h2>
        {excerpt && <p className="mt-3 line-clamp-3 text-sm leading-7 text-ink-600">{excerpt}</p>}
        <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-ink-500">
          {author && <span className="inline-flex items-center gap-1.5"><UserRound size={14} />{author.name}</span>}
          <time dateTime={post.date} className="inline-flex items-center gap-1.5"><CalendarDays size={14} />{formatPostDate(post.date)}</time>
        </div>
        <Link href={postPath} className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-900">
          Đọc bài viết <ArrowRight size={15} />
        </Link>
      </div>
    </article>
  );
}
