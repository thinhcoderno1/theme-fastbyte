import 'server-only';
import { cache } from 'react';
import sanitizeHtml from 'sanitize-html';
import { getWordPressSiteUrl } from '@/lib/env';
import type { WordPressPost } from './types';

const REQUEST_TIMEOUT_MS = 8000;
const SEO_REVALIDATE_SECONDS = 300;

function extractMetaDescription(html: string): string | null {
  let description = '';

  sanitizeHtml(html, {
    allowedTags: ['meta'],
    allowedAttributes: { meta: ['name', 'content'] },
    transformTags: {
      meta: (tagName, attributes) => {
        if (!description && attributes.name?.toLowerCase() === 'description') {
          description = attributes.content || '';
        }
        return { tagName, attribs: attributes };
      },
    },
  });

  const normalized = description.replace(/\s+/g, ' ').trim();
  return normalized || null;
}

const fetchPostMetaDescription = cache(async (link: string, slug: string): Promise<string | null> => {
  try {
    const wordpressOrigin = new URL(getWordPressSiteUrl()).origin;
    const postUrl = new URL(link);
    if (postUrl.origin !== wordpressOrigin) return null;

    const response = await fetch(postUrl, {
      headers: { Accept: 'text/html' },
      next: {
        revalidate: SEO_REVALIDATE_SECONDS,
        tags: ['wordpress-posts', `wordpress-post-${slug}`],
      },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (!response.ok) return null;
    return extractMetaDescription(await response.text());
  } catch {
    return null;
  }
});

export function getPostMetaDescription(post: WordPressPost): Promise<string | null> {
  return fetchPostMetaDescription(post.link, post.slug);
}
