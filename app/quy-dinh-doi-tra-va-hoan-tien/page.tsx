import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { LegalMarkdown } from '@/components/legal/LegalMarkdown';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Quy định đổi trả và hoàn trả tiền | Fast Byte',
  description: 'Điều kiện, quy trình và thời gian hoàn trả dịch vụ tại thuevpsgiare.vn.',
  alternates: { canonical: '/quy-dinh-doi-tra-va-hoan-tien/' },
  openGraph: {
    type: 'article',
    url: '/quy-dinh-doi-tra-va-hoan-tien/',
    title: 'Quy định đổi trả và hoàn trả tiền | Fast Byte',
    description: 'Quy định đổi trả và hoàn trả tiền dịch vụ tại thuevpsgiare.vn.',
  },
};

export const dynamic = 'force-static';

const markdownPath = path.join(process.cwd(), 'content', 'quy-dinh-doi-tra-va-hoan-tien.md');
const refundPolicyMarkdown = readFileSync(markdownPath, 'utf8');

export default function RefundPolicyPage() {
  return (
    <div className="border-b border-line bg-surface-subtle py-12 md:py-16">
      <Container className="max-w-[1040px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-700">Quy định đổi trả và hoàn trả tiền</span>
        </nav>
        <article className="space-y-6 rounded-xl border border-line bg-white px-6 py-8 shadow-sm md:px-11 md:py-12 lg:px-14">
          <LegalMarkdown markdown={refundPolicyMarkdown} />
        </article>
      </Container>
    </div>
  );
}
