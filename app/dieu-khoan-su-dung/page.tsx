import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Điều khoản sử dụng dịch vụ | Fast Byte',
  description:
    'Điều khoản sử dụng dịch vụ tại thuevpsgiare.vn, bao gồm trách nhiệm của khách hàng, trách nhiệm của Fast Byte và quy định tạm ngừng dịch vụ.',
  alternates: {
    canonical: '/dieu-khoan-su-dung/',
  },
  openGraph: {
    type: 'article',
    url: '/dieu-khoan-su-dung/',
    title: 'Điều khoản sử dụng dịch vụ | Fast Byte',
    description: 'Các điều khoản áp dụng khi khách hàng sử dụng dịch vụ tại thuevpsgiare.vn.',
  },
};

export const dynamic = 'force-static';

const markdownPath = path.join(process.cwd(), 'content', 'term-of-use-fastbyte.md');
const termsMarkdown = readFileSync(markdownPath, 'utf8');

const inlinePattern = /(\*\*[^*]+\*\*|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;

function renderInline(content: string): ReactNode[] {
  return content.split(inlinePattern).filter(Boolean).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (linkMatch) {
      return (
        <a
          key={index}
          href={linkMatch[2]}
          target="_blank"
          rel="noopener noreferrer"
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

function renderMarkdown(markdown: string) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();

    if (!line) {
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

    if (line.startsWith('|')) {
      const rawRows: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith('|')) {
        rawRows.push(lines[index].trim());
        index += 1;
      }

      const rows = rawRows.map(parseTableRow).filter((row) => !isTableSeparator(row));
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
                    <td key={cellIndex} className="px-5 py-4 align-top">
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

  return blocks;
}

export default function TermsOfUsePage() {
  return (
    <div className="border-b border-line bg-surface-subtle py-12 md:py-16">
      <Container className="max-w-[1040px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Trang chủ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-700">Điều khoản sử dụng</span>
        </nav>

        <article className="space-y-6 rounded-xl border border-line bg-white px-6 py-8 shadow-sm md:px-11 md:py-12 lg:px-14">
          {renderMarkdown(termsMarkdown)}
        </article>
      </Container>
    </div>
  );
}
