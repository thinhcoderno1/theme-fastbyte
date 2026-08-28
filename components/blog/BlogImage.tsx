import Image from 'next/image';
import type { WordPressPost } from '@/lib/wordpress/types';
import { decodeTitle, getBestImage, getFeaturedMedia } from '@/lib/wordpress/utils';

interface BlogImageProps {
  post: WordPressPost;
  priority?: boolean;
  className?: string;
  sizes?: string;
}

export function BlogImage({ post, priority = false, className = '', sizes = '(max-width: 768px) 100vw, 50vw' }: BlogImageProps) {
  const image = getBestImage(getFeaturedMedia(post));
  const title = decodeTitle(post.title.rendered);

  return (
    <Image
      src={image?.url || '/images/blog-placeholder.svg'}
      alt={image?.alt || `Ảnh minh họa bài viết ${title}`}
      width={image?.width || 1200}
      height={image?.height || 675}
      sizes={sizes}
      priority={priority}
      className={`h-full w-full object-cover ${className}`}
    />
  );
}
