import 'server-only';
import { collectionFromHeaders, wordpressFetch } from './api';
import type {
  GetPostsParams,
  WordPressAuthor,
  WordPressCategory,
  WordPressCollection,
  WordPressPost,
  WordPressSitemapPost,
  WordPressTag,
} from './types';

const POST_FIELDS = [
  'id', 'date', 'modified', 'slug', 'status', 'link', 'title', 'content', 'excerpt',
  'author', 'featured_media', 'categories', 'tags', 'sticky', '_links', '_embedded',
].join(',');

function postParams(input: GetPostsParams = {}): URLSearchParams {
  const page = Math.max(1, input.page || 1);
  const perPage = Math.min(100, Math.max(1, input.perPage || 10));
  const params = new URLSearchParams({
    status: 'publish',
    page: String(page),
    per_page: String(perPage),
    order: input.order || 'desc',
    orderby: input.orderby || 'date',
    _embed: 'wp:featuredmedia,author,wp:term',
    _fields: POST_FIELDS,
  });
  if (input.categories?.length) params.set('categories', input.categories.join(','));
  if (input.author) params.set('author', String(input.author));
  if (input.search) params.set('search', input.search.trim());
  if (input.exclude?.length) params.set('exclude', input.exclude.join(','));
  if (typeof input.sticky === 'boolean') params.set('sticky', String(input.sticky));
  return params;
}

export async function getPosts(input: GetPostsParams = {}): Promise<WordPressCollection<WordPressPost>> {
  const params = postParams(input);
  const page = Number(params.get('page'));
  const perPage = Number(params.get('per_page'));
  const { data, headers } = await wordpressFetch<WordPressPost[]>('posts', params, { tags: ['wordpress-posts'] });
  return collectionFromHeaders(data, headers, page, perPage);
}

export async function getSitemapPosts(page = 1, perPage = 100): Promise<WordPressCollection<WordPressSitemapPost>> {
  const normalizedPage = Math.max(1, page);
  const normalizedPerPage = Math.min(100, Math.max(1, perPage));
  const params = new URLSearchParams({
    status: 'publish',
    page: String(normalizedPage),
    per_page: String(normalizedPerPage),
    order: 'desc',
    orderby: 'modified',
    _fields: 'id,slug,modified_gmt',
  });
  const { data, headers } = await wordpressFetch<WordPressSitemapPost[]>('posts', params, {
    tags: ['wordpress-posts'],
  });
  return collectionFromHeaders(data, headers, normalizedPage, normalizedPerPage);
}

export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const params = postParams({ perPage: 1 });
  params.set('slug', slug);
  const { data } = await wordpressFetch<WordPressPost[]>('posts', params, {
    tags: ['wordpress-posts', `wordpress-post-${slug}`],
  });
  return data[0] || null;
}

export async function getFeaturedPosts(limit = 3): Promise<WordPressPost[]> {
  return (await getPosts({ perPage: limit, sticky: true })).data;
}

export async function getRelatedPosts(post: WordPressPost, limit = 3): Promise<WordPressPost[]> {
  return (await getPosts({
    perPage: limit,
    categories: post.categories.slice(0, 1),
    exclude: [post.id],
  })).data;
}

export async function getCategories(page = 1, perPage = 100): Promise<WordPressCollection<WordPressCategory>> {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage), hide_empty: 'true' });
  const { data, headers } = await wordpressFetch<WordPressCategory[]>('categories', params, {
    tags: ['wordpress-categories'],
  });
  return collectionFromHeaders(data, headers, page, perPage);
}

export async function getCategoryBySlug(slug: string): Promise<WordPressCategory | null> {
  const params = new URLSearchParams({ slug, per_page: '1' });
  const { data } = await wordpressFetch<WordPressCategory[]>('categories', params, {
    tags: ['wordpress-categories', `wordpress-category-${slug}`],
  });
  return data[0] || null;
}

export async function getPostsByCategory(categoryId: number, page = 1, perPage = 9) {
  return getPosts({ categories: [categoryId], page, perPage });
}

export async function getTags(page = 1, perPage = 100): Promise<WordPressCollection<WordPressTag>> {
  const params = new URLSearchParams({ page: String(page), per_page: String(perPage), hide_empty: 'true' });
  const { data, headers } = await wordpressFetch<WordPressTag[]>('tags', params, { tags: ['wordpress-tags'] });
  return collectionFromHeaders(data, headers, page, perPage);
}

export async function getAuthorBySlug(slug: string): Promise<WordPressAuthor | null> {
  const params = new URLSearchParams({ slug, per_page: '1' });
  const { data } = await wordpressFetch<WordPressAuthor[]>('users', params, { tags: ['wordpress-authors'] });
  return data[0] || null;
}

export async function getPostsByAuthor(authorId: number, page = 1, perPage = 9) {
  return getPosts({ author: authorId, page, perPage });
}

export async function searchPosts(search: string, page = 1, perPage = 9) {
  return getPosts({ search, page, perPage, orderby: 'relevance' });
}
