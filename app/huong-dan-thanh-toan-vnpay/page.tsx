import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { LegalMarkdown } from '@/components/legal/LegalMarkdown';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Hướng dẫn thanh toán VNPAY trên Website/APP | Fast Byte',
  description: 'Hướng dẫn thanh toán dịch vụ Fast Byte qua VNPAY-QR, thẻ ngân hàng, ví VNPAY và Apple Pay.',
  alternates: { canonical: '/huong-dan-thanh-toan-vnpay/' },
  openGraph: {
    type: 'article',
    url: '/huong-dan-thanh-toan-vnpay/',
    title: 'Hướng dẫn thanh toán VNPAY trên Website/APP | Fast Byte',
    description: 'Các bước thanh toán dịch vụ Fast Byte qua cổng VNPAY.',
  },
};

export const dynamic = 'force-static';

const markdownPath = path.join(process.cwd(), 'content', 'huong-dan-thanh-toan-vnpay.md');
const vnpayGuideMarkdown = readFileSync(markdownPath, 'utf8');

export default function VnpayGuidePage() {
  return (
    <div className="border-b border-line bg-surface-subtle py-12 md:py-16">
      <Container className="max-w-[1040px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">Trang chủ</Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-700">Hướng dẫn thanh toán VNPAY</span>
        </nav>
        <article className="space-y-6 rounded-xl border border-line bg-white px-6 py-8 shadow-sm md:px-11 md:py-12 lg:px-14">
          <LegalMarkdown markdown={vnpayGuideMarkdown} />
        </article>
      </Container>
    </div>
  );
}
