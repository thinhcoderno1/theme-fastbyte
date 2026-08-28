import 'server-only';
import { getWordPressApiUrl } from '@/lib/env';
import type { WordPressCollection } from './types';

const DEFAULT_REVALIDATE = 300;
const REQUEST_TIMEOUT_MS = 8000;

export class WordPressApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'WordPressApiError';
    this.status = status;
  }
}

interface FetchOptions {
  tags?: string[];
  revalidate?: number;
}

export async function wordpressFetch<T>(
  resource: string,
  params: URLSearchParams,
  options: FetchOptions = {},
): Promise<{ data: T; headers: Headers }> {
  const url = new URL(`${getWordPressApiUrl()}/${resource.replace(/^\//, '')}`);
  url.search = params.toString();

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
      next: {
        revalidate: options.revalidate ?? DEFAULT_REVALIDATE,
        tags: options.tags || [],
      },
    });
  } catch (error) {
    const reason = error instanceof Error && error.name === 'TimeoutError'
      ? 'WordPress phản hồi quá thời gian cho phép.'
      : 'Không thể kết nối tới WordPress.';
    throw new WordPressApiError(reason);
  }

  if (!response.ok) {
    if (response.status === 400 && params.has('page')) {
      return { data: [] as T, headers: response.headers };
    }
    throw new WordPressApiError(
      response.status === 404 ? 'Không tìm thấy dữ liệu WordPress.' : 'WordPress API tạm thời không khả dụng.',
      response.status,
    );
  }

  try {
    return { data: await response.json() as T, headers: response.headers };
  } catch {
    throw new WordPressApiError('WordPress API trả về dữ liệu không hợp lệ.', response.status);
  }
}

export function collectionFromHeaders<T>(
  data: T[],
  headers: Headers,
  page: number,
  perPage: number,
): WordPressCollection<T> {
  return {
    data,
    pagination: {
      total: Number(headers.get('X-WP-Total') || data.length),
      totalPages: Number(headers.get('X-WP-TotalPages') || (data.length ? 1 : 0)),
      page,
      perPage,
    },
  };
}
