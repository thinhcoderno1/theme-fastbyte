import type { WordPressPost } from '@/lib/wordpress/types';
import { BlogCard } from './BlogCard';

export function BlogGrid({ posts }: { posts: WordPressPost[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => <BlogCard key={post.id} post={post} />)}
    </div>
  );
}
