export interface WordPressRendered {
  rendered: string;
  protected?: boolean;
}

export interface WordPressMediaSize {
  source_url: string;
  width: number;
  height: number;
}

export interface WordPressMedia {
  id: number;
  alt_text: string;
  caption?: WordPressRendered;
  source_url: string;
  media_details?: {
    width?: number;
    height?: number;
    sizes?: Record<string, WordPressMediaSize>;
  };
}

export interface WordPressAuthor {
  id: number;
  name: string;
  slug: string;
  description?: string;
  avatar_urls?: Record<string, string>;
  link?: string;
}

export interface WordPressCategory {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
  parent: number;
}

export interface WordPressTag {
  id: number;
  count: number;
  description: string;
  link: string;
  name: string;
  slug: string;
}

export type WordPressTerm = WordPressCategory | WordPressTag;

export interface WordPressPostEmbedded {
  author?: WordPressAuthor[];
  'wp:featuredmedia'?: WordPressMedia[];
  'wp:term'?: WordPressTerm[][];
}

export interface WordPressPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  status: string;
  link: string;
  title: WordPressRendered;
  content: WordPressRendered;
  excerpt: WordPressRendered;
  author: number;
  featured_media: number;
  categories: number[];
  tags: number[];
  sticky: boolean;
  _embedded?: WordPressPostEmbedded;
}

export interface WordPressSitemapPost {
  id: number;
  slug: string;
  modified_gmt: string;
}

export interface WordPressPagination {
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface WordPressCollection<T> {
  data: T[];
  pagination: WordPressPagination;
}

export interface GetPostsParams {
  page?: number;
  perPage?: number;
  categories?: number[];
  author?: number;
  search?: string;
  exclude?: number[];
  sticky?: boolean;
  order?: 'asc' | 'desc';
  orderby?: 'date' | 'modified' | 'title' | 'relevance';
}

export interface ContentHeading {
  id: string;
  text: string;
  level: 2 | 3;
}
