import type { Metadata } from 'next';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import Link from 'next/link';
import { LegalMarkdown } from '@/components/legal/LegalMarkdown';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Chính sách xử lý khiếu nại | Fast Byte',
  description: 'Quy định và quy trình tiếp nhận, giải quyết khiếu nại của khách hàng tại thuevpsgiare.vn.',
  alternates: {
    canonical: '/chinh-sach-xu-ly-khieu-nai/',
  },
  openGraph: {
    type: 'article',
    url: '/chinh-sach-xu-ly-khieu-nai/',
    title: 'Chính sách xử lý khiếu nại | Fast Byte',
    description: 'Chính sách tiếp nhận và giải quyết khiếu nại của khách hàng tại thuevpsgiare.vn.',
  },
};

export const dynamic = 'force-static';

const markdownPath = path.join(process.cwd(), 'content', 'chinh-sach-xu-ly-khieu-nai.md');
const complaintPolicyMarkdown = readFileSync(markdownPath, 'utf8');

export default function ComplaintPolicyPage() {
  return (
    <div className="border-b border-line bg-surface-subtle py-12 md:py-16">
      <Container className="max-w-[1040px]">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] font-medium text-ink-500">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Trang chủ
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-brand-700">Chính sách xử lý khiếu nại</span>
        </nav>

        <article className="space-y-6 rounded-xl border border-line bg-white px-6 py-8 shadow-sm md:px-11 md:py-12 lg:px-14">
          <LegalMarkdown markdown={complaintPolicyMarkdown} />
        </article>
      </Container>
    </div>
  );
}
