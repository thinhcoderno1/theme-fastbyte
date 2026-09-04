'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { ContentHeading } from '@/lib/wordpress/types';

interface HeadingGroup {
  heading: ContentHeading;
  children: ContentHeading[];
}

function groupHeadings(headings: ContentHeading[]): HeadingGroup[] {
  return headings.reduce<HeadingGroup[]>((groups, heading) => {
    if (heading.level === 2) {
      groups.push({ heading, children: [] });
    } else {
      groups.at(-1)?.children.push(heading);
    }

    return groups;
  }, []);
}

export function TableOfContents({ headings }: { headings: ContentHeading[] }) {
  const [expandedHeadings, setExpandedHeadings] = useState<Set<string>>(() => new Set());
  const groups = groupHeadings(headings);

  if (!groups.length) return null;

  const toggleHeading = (id: string) => {
    setExpandedHeadings((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <nav className="rounded-xl border border-brand-100 bg-brand-50 p-5" aria-label="Mục lục bài viết">
      <h2 className="text-lg">Mục lục bài viết</h2>
      <ol className="mt-3 space-y-1 text-sm">
        {groups.map(({ heading, children }) => {
          const hasChildren = children.length > 0;
          const isExpanded = expandedHeadings.has(heading.id);
          const childListId = `toc-children-${heading.id}`;

          return (
            <li key={heading.id}>
              <div className="flex items-start gap-1">
                <a className="min-w-0 flex-1 py-1 text-ink-700 hover:text-brand-700" href={`#${heading.id}`}>
                  {heading.text}
                </a>
                {hasChildren && (
                  <button
                    type="button"
                    className="flex size-7 shrink-0 items-center justify-center rounded-md text-ink-500 transition-colors hover:bg-brand-100 hover:text-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                    aria-expanded={isExpanded}
                    aria-controls={childListId}
                    aria-label={`${isExpanded ? 'Thu gọn' : 'Mở rộng'} các mục con của ${heading.text}`}
                    onClick={() => toggleHeading(heading.id)}
                  >
                    <ChevronDown
                      aria-hidden="true"
                      className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                      size={16}
                    />
                  </button>
                )}
              </div>
              {hasChildren && isExpanded && (
                <ol id={childListId} className="mb-1 ml-3 space-y-1 border-l border-brand-200 pl-3">
                  {children.map((child) => (
                    <li key={child.id}>
                      <a className="block py-1 text-ink-600 hover:text-brand-700" href={`#${child.id}`}>
                        {child.text}
                      </a>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
