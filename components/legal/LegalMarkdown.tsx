/* eslint-disable @next/next/no-img-element */

import type { ReactNode } from 'react';

const inlinePattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\((?:https?:\/\/|mailto:)[^)]+\))/g;

function renderInline(content: string): ReactNode[] {
  return content.split(inlinePattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^)]+)\)$/);
    if (linkMatch) {
      const isWebLink = linkMatch[2].startsWith('http');
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target={isWebLink ? '_blank' : undefined}
          rel={isWebLink ? 'noopener noreferrer' : undefined}
          className="font-semibold text-brand-700 underline decoration-brand-200 underline-offset-4 transition-colors hover:text-brand-900"
        >
          {linkMatch[1]}
        </a>
      );
    }

    return part;
  });
}

function isTableSeparator(cells: string[]) {
  return cells.every((cell) => /^:?-{3,}:?$/.test(cell));
}

function parseTableRow(row: string) {
  return row
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

export function LegalMarkdown({ markdown }: { markdown: string }) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
      index += 1;
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\((https?:\/\/[^)]+)\)$/);
    if (imageMatch) {
      blocks.push(
        <figure key={`image-${index}`} className="my-7 overflow-hidden rounded-lg border border-line bg-surface-subtle p-2 shadow-xs">
          <img
            src={imageMatch[2]}
            alt={imageMatch[1]}
            loading="lazy"
            decoding="async"
            className="mx-auto h-auto max-h-[760px] w-auto max-w-full rounded-md object-contain"
          />
        </figure>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('# ')) {
      blocks.push(
        <h1 key={`h1-${index}`} className="text-balance font-heading text-[34px] font-extrabold tracking-[-0.035em] text-brand-900 md:text-[46px]">
          {renderInline(line.slice(2))}
        </h1>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('## ')) {
      blocks.push(
        <h2 key={`h2-${index}`} className="mt-12 border-b border-line pb-3 font-heading text-[23px] font-bold tracking-[-0.02em] text-ink-900 md:text-[27px]">
          {renderInline(line.slice(3))}
        </h2>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('### ')) {
      blocks.push(
        <h3 key={`h3-${index}`} className="mt-9 font-heading text-[19px] font-bold leading-snug text-ink-900 md:text-[21px]">
          {renderInline(line.slice(4))}
        </h3>,
      );
      index += 1;
      continue;
    }

    if (line.startsWith('|')) {
      const rawRows: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rawRows.push(lines[index].trim());
        index += 1;
      }

      const continuationItems: string[] = [];
      let lookahead = index;
      while (lookahead < lines.length && lines[lookahead].trim().startsWith('- ')) {
        continuationItems.push(lines[lookahead].trim());
        lookahead += 1;
      }

      const continuedRows: string[] = [];
      if (continuationItems.length > 0 && lookahead < lines.length && lines[lookahead].trim().startsWith('|')) {
        index = lookahead;
        while (index < lines.length && lines[index].trim().startsWith('|')) {
          continuedRows.push(lines[index].trim());
          index += 1;
        }
      }

      const rows = rawRows.map(parseTableRow).filter((row) => !isTableSeparator(row));
      if (continuedRows.length > 0) {
        const lastRow = rows[rows.length - 1];
        const lastCellIndex = lastRow.length - 1;
        lastRow[lastCellIndex] = `${lastRow[lastCellIndex]}\n${continuationItems.join('\n')}`;
        rows.push(...continuedRows.map(parseTableRow).filter((row) => !isTableSeparator(row)));
      }
      const [header, ...body] = rows;

      blocks.push(
        <div key={`table-${index}`} className="my-7 overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[680px] border-collapse text-left text-[14px] leading-relaxed">
            <thead className="bg-brand-50 text-brand-900">
              <tr>
                {header.map((cell, cellIndex) => (
                  <th key={cellIndex} className="border-b border-line px-5 py-4 font-heading text-[14px] font-bold">
                    {renderInline(cell)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white text-ink-600">
              {body.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="whitespace-pre-line px-5 py-4 align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>,
      );
      continue;
    }

    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('- ')) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }

      blocks.push(
        <ul key={`list-${index}`} className="my-5 space-y-3 pl-1 text-[15px] leading-7 text-ink-600 md:text-[16px]">
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="flex gap-3">
              <span className="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    const paragraph: string[] = [line];
    index += 1;
    while (index < lines.length && lines[index].trim()) {
      const nextLine = lines[index].trim();
      if (nextLine.startsWith('#') || nextLine.startsWith('|') || nextLine.startsWith('- ')) break;
      paragraph.push(nextLine);
      index += 1;
    }

    blocks.push(
      <p key={`p-${index}`} className="text-[15px] leading-7 text-ink-600 md:text-[16px] md:leading-8">
        {renderInline(paragraph.join(' '))}
      </p>,
    );
  }

  return <>{blocks}</>;
}
