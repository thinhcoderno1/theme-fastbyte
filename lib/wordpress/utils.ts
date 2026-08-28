import sanitizeHtml from 'sanitize-html';
import type {
  ContentHeading,
  WordPressAuthor,
  WordPressCategory,
  WordPressMedia,
  WordPressPost,
  WordPressTag,
} from './types';

const HTML_TEXT_ENTITIES: Record<string, string> = {
  amp: '&',
  apos: "'",
  gt: '>',
  lt: '<',
  nbsp: ' ',
  quot: '"',
};

const SAFE_INLINE_STYLE_VALUE = /^(?!.*(?:expression\s*\(|javascript\s*:|vbscript\s*:|url\s*\(|@import|behavior\s*:|[{}<>]))[\s\S]*$/i;
const SAFE_INLINE_STYLE_PROPERTIES = [
  'accent-color',
  'align-items',
  'background',
  'background-color',
  'border',
  'border-bottom',
  'border-collapse',
  'border-color',
  'border-left',
  'border-radius',
  'border-style',
  'border-top',
  'box-shadow',
  'clear',
  'color',
  'display',
  'flex',
  'flex-wrap',
  'float',
  'font-family',
  'font-size',
  'font-style',
  'font-weight',
  'height',
  'justify-content',
  'left',
  'line-height',
  'list-style',
  'list-style-type',
  'margin',
  'margin-bottom',
  'margin-left',
  'margin-right',
  'margin-top',
  'max-height',
  'max-width',
  'min-height',
  'min-width',
  'overflow',
  'overflow-x',
  'overflow-y',
  'padding',
  'padding-bottom',
  'padding-left',
  'padding-right',
  'padding-top',
  'position',
  'text-align',
  'text-decoration',
  'text-transform',
  'vertical-align',
  'white-space',
  'width',
] as const;

const SAFE_INLINE_STYLES = Object.fromEntries(
  SAFE_INLINE_STYLE_PROPERTIES.map((property) => [property, [SAFE_INLINE_STYLE_VALUE]]),
);

function decodeHtmlTextEntities(value: string): string {
  return value.replace(/&(?:#(\d+)|#x([\da-f]+)|([a-z]+));/gi, (entity, decimal, hexadecimal, named) => {
    if (decimal || hexadecimal) {
      const codePoint = Number.parseInt(decimal || hexadecimal, decimal ? 10 : 16);
      return Number.isSafeInteger(codePoint) && codePoint > 0 && codePoint <= 0x10ffff
        ? String.fromCodePoint(codePoint)
        : entity;
    }

    return HTML_TEXT_ENTITIES[String(named).toLowerCase()] ?? entity;
  });
}

export function stripHtml(value: string): string {
  return decodeHtmlTextEntities(sanitizeHtml(value, { allowedTags: [], allowedAttributes: {} }))
    .replace(/\s+/g, ' ')
    .trim();
}

export function decodeTitle(value: string): string {
  return stripHtml(value);
}

export function slugifyHeading(value: string): string {
  return stripHtml(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'noi-dung';
}

export function prepareWordPressContent(content: string): { html: string; headings: ContentHeading[] } {
  const headings: ContentHeading[] = [];
  const usedIds = new Map<string, number>();
  const sourceWithHeadingIds = content.replace(
    /<h([23])\b([^>]*)>([\s\S]*?)<\/h\1>/gi,
    (_match, rawLevel: string, rawAttributes: string, innerHtml: string) => {
      const text = stripHtml(innerHtml);
      const baseId = slugifyHeading(text);
      const count = usedIds.get(baseId) || 0;
      usedIds.set(baseId, count + 1);
      const id = count === 0 ? baseId : `${baseId}-${count + 1}`;
      const level = Number(rawLevel) as 2 | 3;
      headings.push({ id, text, level });
      const attributes = rawAttributes.replace(/\s+id=(['"]).*?\1/i, '');
      return `<h${level}${attributes} id="${id}">${innerHtml}</h${level}>`;
    },
  );

  const html = sanitizeHtml(sourceWithHeadingIds, {
    allowedTags: [
      'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'a', 'ul', 'ol', 'li',
      'h2', 'h3', 'h4', 'figure', 'figcaption', 'img', 'picture', 'source',
      'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'blockquote', 'cite',
      'pre', 'code', 'hr', 'div', 'span', 'mark', 'sub', 'sup', 'details', 'summary',
    ],
    allowedAttributes: {
      '*': ['style'],
      a: ['href', 'title', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes'],
      source: ['srcset', 'sizes', 'type', 'media'],
      h2: ['id'],
      h3: ['id'],
      h4: ['id'],
      th: ['scope', 'colspan', 'rowspan'],
      td: ['colspan', 'rowspan'],
      div: ['class'],
      span: ['class'],
      figure: ['class'],
      p: ['class'],
    },
    allowedClasses: {
      '*': ['wp-block-*', 'alignleft', 'alignright', 'aligncenter', 'is-style-*', 'has-*'],
    },
    allowedStyles: {
      '*': SAFE_INLINE_STYLES,
    },
    allowedSchemes: ['http', 'https', 'mailto', 'tel'],
    allowProtocolRelative: false,
    disallowedTagsMode: 'discard',
    transformTags: {
      a: (tagName, attribs) => {
        const isExternal = /^https?:\/\//i.test(attribs.href || '');
        return {
          tagName,
          attribs: isExternal
            ? { ...attribs, target: '_blank', rel: 'noopener noreferrer' }
            : attribs,
        };
      },
      img: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, loading: attribs.loading || 'lazy', decoding: 'async' },
      }),
    },
  });

  return { html, headings };
}

export function estimateReadingTime(content: string): number {
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function formatPostDate(value: string): string {
  return new Intl.DateTimeFormat('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value));
}

export function getFeaturedMedia(post: WordPressPost): WordPressMedia | null {
  return post._embedded?.['wp:featuredmedia']?.[0] || null;
}

export function getPostAuthor(post: WordPressPost): WordPressAuthor | null {
  return post._embedded?.author?.[0] || null;
}

export function getPostTerms(post: WordPressPost): { categories: WordPressCategory[]; tags: WordPressTag[] } {
  const groups = post._embedded?.['wp:term'] || [];
  const terms = groups.flat();
  return {
    categories: terms.filter((term) => post.categories.includes(term.id)) as WordPressCategory[],
    tags: terms.filter((term) => post.tags.includes(term.id)) as WordPressTag[],
  };
}

export function getBestImage(media: WordPressMedia | null, preferredSize = 'large'): WordPressMediaSizeLike | null {
  if (!media) return null;
  const sized = media.media_details?.sizes?.[preferredSize]
    || media.media_details?.sizes?.medium_large
    || media.media_details?.sizes?.medium;

  return {
    url: sized?.source_url || media.source_url,
    width: sized?.width || media.media_details?.width || 1200,
    height: sized?.height || media.media_details?.height || 630,
    alt: media.alt_text,
  };
}

interface WordPressMediaSizeLike {
  url: string;
  width: number;
  height: number;
  alt: string;
}
