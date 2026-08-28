import type { ContentHeading } from '@/lib/wordpress/types';

export function TableOfContents({ headings }: { headings: ContentHeading[] }) {
  if (!headings.length) return null;
  return (
    <nav className="rounded-xl border border-brand-100 bg-brand-50 p-5" aria-label="Mục lục bài viết">
      <h2 className="text-lg">Mục lục bài viết</h2>
      <ol className="mt-3 space-y-2 text-sm">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.level === 3 ? 'pl-4' : ''}>
            <a className="text-ink-700 hover:text-brand-700" href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
