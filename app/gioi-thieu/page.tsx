import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  CloudCog,
  FileText,
  Headphones,
  MapPin,
  Scale,
  Server,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'Giới thiệu Fast Byte | Thuê VPS Giá Rẻ',
  description:
    'Tìm hiểu về Công ty TNHH Dữ Liệu Nhanh Fast Byte, định hướng dịch vụ, hạ tầng VPS và các nguyên tắc vận hành tại ThueVPSGiaRe.vn.',
  alternates: { canonical: '/gioi-thieu/' },
};

const services = [
  {
    icon: Server,
    title: 'Cloud VPS theo nhu cầu',
    description:
      'Nhiều cấu hình cho website, ứng dụng, môi trường phát triển và các tác vụ cần tài nguyên máy chủ riêng.',
  },
  {
    icon: CloudCog,
    title: 'Chủ động quản trị',
    description:
      'Khách hàng có quyền quản trị VPS và lựa chọn hệ điều hành phù hợp theo từng gói dịch vụ.',
  },
  {
    icon: Headphones,
    title: 'Hỗ trợ có hệ thống',
    description:
      'Yêu cầu kỹ thuật được tiếp nhận qua cổng Ticket; tư vấn dịch vụ có thể thực hiện qua hotline hoặc email.',
  },
];

const operatingPrinciples = [
  'Công khai cấu hình, chu kỳ và mức giá trước khi khách hàng đăng ký.',
  'Thiết kế dịch vụ để khách hàng chủ động quản lý tài nguyên của mình.',
  'Duy trì kênh hỗ trợ chính thức để yêu cầu được ghi nhận và theo dõi.',
  'Công bố rõ điều khoản, chính sách bảo mật và quy trình xử lý khiếu nại.',
];

const policies = [
  { label: 'Điều khoản sử dụng', href: '/dieu-khoan-su-dung/' },
  { label: 'Chính sách bảo mật', href: '/chinh-sach-bao-mat/' },
  { label: 'Xử lý khiếu nại', href: '/chinh-sach-xu-ly-khieu-nai/' },
  { label: 'Đổi trả và hoàn tiền', href: '/quy-dinh-doi-tra-va-hoan-tien/' },
];

export default function AboutPage() {
  return (
    <main>
      <section className="hero-pattern overflow-hidden py-16 text-white md:py-20">
        <Container>
          <div className="grid items-center gap-10 lg:grid-cols-[1.35fr_0.8fr] lg:gap-16">
            <FadeIn>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-brand-50">
                <Building2 size={16} aria-hidden="true" />
                Về Fast Byte
              </div>
              <h1 className="max-w-3xl text-balance text-white">
                Hạ tầng VPS rõ ràng, vận hành thực tế
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 md:text-lg">
                ThueVPSGiaRe.vn là kênh cung cấp dịch vụ máy chủ ảo của Công ty TNHH Dữ Liệu Nhanh Fast Byte. Chúng tôi tập trung vào cấu hình dễ chọn, quyền quản trị chủ động và quy trình hỗ trợ minh bạch.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  href="/#bang-gia"
                  variant="dark-primary"
                  size="lg"
                  icon={<ArrowRight size={17} />}
                >
                  Xem bảng giá VPS
                </Button>
                <Button href="/lien-he/" variant="dark-outline" size="lg">
                  Liên hệ tư vấn
                </Button>
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <aside className="rounded-2xl border border-white/15 bg-white p-6 text-ink-700 shadow-2xl md:p-7" aria-label="Thông tin doanh nghiệp">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Thông tin doanh nghiệp</p>
                <h2 className="mt-3 text-xl leading-7 text-ink-900">CTY TNHH Dữ Liệu Nhanh Fast Byte</h2>
                <dl className="mt-6 space-y-4 text-sm leading-6">
                  <div className="flex gap-3">
                    <Scale className="mt-0.5 shrink-0 text-brand-700" size={19} aria-hidden="true" />
                    <div><dt className="font-semibold text-ink-900">Mã số thuế</dt><dd>0316985515</dd></div>
                  </div>
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 shrink-0 text-brand-700" size={19} aria-hidden="true" />
                    <div><dt className="font-semibold text-ink-900">Địa chỉ</dt><dd>200 Song Hành, P. Bình Trưng, TP. HCM</dd></div>
                  </div>
                </dl>
              </aside>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="about-services-title">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Dịch vụ cốt lõi</p>
            <h2 id="about-services-title" className="mt-3 text-balance">Fast Byte cung cấp gì?</h2>
            <p className="mt-4 text-base leading-7 text-ink-500">
              Một nền tảng VPS đủ linh hoạt cho cá nhân và doanh nghiệp, với thông tin gói dịch vụ được trình bày trực tiếp để dễ đối chiếu trước khi mua.
            </p>
          </FadeIn>
          <FadeInStagger className="mt-10 grid gap-5 md:grid-cols-3">
            {services.map(({ icon: Icon, title, description }) => (
              <FadeIn key={title} fullWidth className="h-full">
                <article className="card-hover-effect rounded-2xl border border-line bg-white p-6 shadow-sm h-full">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Icon size={22} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5">{title}</h3>
                  <p className="mt-3 text-sm leading-6 text-ink-500">{description}</p>
                </article>
              </FadeIn>
            ))}
          </FadeInStagger>
        </Container>
      </section>

      <section className="bg-surface-subtle py-16 md:py-20" aria-labelledby="infrastructure-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Nền tảng dịch vụ</p>
              <h2 id="infrastructure-title" className="mt-3 text-balance">Hạ tầng phù hợp với công việc thực tế</h2>
              <p className="mt-5 leading-7">
                Các dòng VPS được công bố sử dụng công nghệ ảo hóa KVM cùng nền tảng lưu trữ SSD Enterprise hoặc NVMe tùy gói. Khách hàng có thể chọn cấu hình theo CPU, RAM, dung lượng và chu kỳ sử dụng thay vì phải mua thừa tài nguyên.
              </p>
              <div className="mt-6 rounded-xl border border-brand-100 bg-brand-50 p-5 text-sm leading-6 text-ink-700">
                <strong className="text-ink-900">Lưu ý:</strong> thông số phần cứng, hệ điều hành và tính năng đi kèm có thể khác nhau giữa từng dòng sản phẩm. Bảng giá tại trang chủ là nguồn đối chiếu trước khi đăng ký.
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="rounded-2xl border border-line bg-white p-6 shadow-sm md:p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-brand-700" size={25} aria-hidden="true" />
                  <h3>Nguyên tắc vận hành</h3>
                </div>
                <ul className="mt-6 space-y-4">
                  {operatingPrinciples.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-6 text-ink-600">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-brand-600" size={19} aria-hidden="true" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="transparency-title">
        <Container>
          <FadeIn>
            <div className="rounded-2xl border border-line bg-white p-7 shadow-sm md:p-10">
              <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <FileText size={22} aria-hidden="true" />
                  </div>
                  <h2 id="transparency-title" className="mt-5">Minh bạch từ trước khi đăng ký</h2>
                  <p className="mt-4 leading-7">
                    Các quy định quan trọng được công khai để khách hàng có thể đọc và cân nhắc trước khi sử dụng dịch vụ.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {policies.map((policy) => (
                    <Link
                      key={policy.href}
                      href={policy.href}
                      className="group flex items-center justify-between rounded-xl border border-line px-4 py-4 font-semibold text-ink-700 transition-colors hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700"
                    >
                      <span>{policy.label}</span>
                      <ArrowRight className="shrink-0 transition-transform group-hover:translate-x-0.5" size={17} aria-hidden="true" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-brand-800 py-12 text-white">
        <Container className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <FadeIn>
            <h2 className="text-2xl text-white">Cần chọn cấu hình VPS phù hợp?</h2>
            <p className="mt-2 text-brand-100">Trao đổi nhu cầu sử dụng trước khi quyết định gói và chu kỳ.</p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <Button href="/lien-he/" variant="dark-primary" size="lg" icon={<ArrowRight size={17} />}>
              Liên hệ Fast Byte
            </Button>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
