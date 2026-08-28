import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  query?: Record<string, string>;
}

function pageHref(basePath: string, page: number, query: Record<string, string>) {
  const params = new URLSearchParams(query);
  if (page > 1) params.set('page', String(page));
  else params.delete('page');
  const suffix = params.toString();
  return `${basePath}${suffix ? `?${suffix}` : ''}`;
}

export function Pagination({ currentPage, totalPages, basePath, query = {} }: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1)
    .filter((page) => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1);

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Phân trang bài viết">
      {currentPage > 1 && (
        <Link className="inline-flex h-10 items-center gap-1 rounded-md border border-line-strong px-3 text-sm font-semibold hover:border-brand-300 hover:text-brand-700" href={pageHref(basePath, currentPage - 1, query)}>
          <ChevronLeft size={16} /> Trước
        </Link>
      )}
      {pages.map((page, index) => {
        const previous = pages[index - 1];
        return (
          <span key={page} className="contents">
            {previous && page - previous > 1 && <span className="px-1" aria-hidden="true">…</span>}
            <Link
              href={pageHref(basePath, page, query)}
              aria-current={page === currentPage ? 'page' : undefined}
              className={`inline-flex h-10 min-w-10 items-center justify-center rounded-md border px-3 text-sm font-semibold ${page === currentPage ? 'border-brand-700 bg-brand-700 text-white' : 'border-line-strong hover:border-brand-300 hover:text-brand-700'}`}
            >
              {page}
            </Link>
          </span>
        );
      })}
      {currentPage < totalPages && (
        <Link className="inline-flex h-10 items-center gap-1 rounded-md border border-line-strong px-3 text-sm font-semibold hover:border-brand-300 hover:text-brand-700" href={pageHref(basePath, currentPage + 1, query)}>
          Sau <ChevronRight size={16} />
        </Link>
      )}
    </nav>
  );
}
