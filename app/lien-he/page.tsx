import type { Metadata } from 'next';
import {
  ArrowRight,
  Building2,
  ExternalLink,
  FileQuestion,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  ReceiptText,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export const metadata: Metadata = {
  title: 'Liên hệ Fast Byte | Thuê VPS Giá Rẻ',
  description:
    'Liên hệ Fast Byte qua hotline, email hoặc hệ thống Ticket để được tư vấn dịch vụ và hỗ trợ kỹ thuật VPS.',
  alternates: { canonical: '/lien-he/' },
};

const contactChannels = [
  {
    icon: Phone,
    label: 'Hotline',
    value: '0287 300 6198',
    description: 'Tư vấn gói dịch vụ hoặc trao đổi vấn đề cần hỗ trợ trực tiếp.',
    href: 'tel:02873006198',
    action: 'Gọi ngay',
    external: false,
  },
  {
    icon: MessageSquareText,
    label: 'Ticket hỗ trợ',
    value: 'Cổng khách hàng Fast Byte',
    description: 'Kênh chính thức để gửi, theo dõi và bổ sung thông tin cho yêu cầu kỹ thuật.',
    href: 'https://id.thuevpsgiare.vn/submitticket.php',
    action: 'Gửi Ticket',
    external: true,
  },
  {
    icon: Mail,
    label: 'Email hỗ trợ',
    value: 'info@thuevpsgiare.vn',
    description: 'Gửi nội dung cần hỗ trợ và thông tin dịch vụ liên quan qua email.',
    href: 'mailto:info@thuevpsgiare.vn',
    action: 'Gửi email',
    external: false,
  },
  {
    icon: Building2,
    label: 'Thông tin doanh nghiệp',
    value: 'info@thuevpsgiare.vn',
    description: 'Trao đổi nội dung doanh nghiệp, hợp tác hoặc thông tin hành chính.',
    href: 'mailto:info@thuevpsgiare.vn',
    action: 'Liên hệ',
    external: false,
  },
];

const channelGuide = [
  {
    icon: FileQuestion,
    title: 'Sự cố hoặc yêu cầu kỹ thuật',
    content: 'Gửi Ticket và cung cấp mã dịch vụ, địa chỉ IP cùng mô tả lỗi. Không gửi mật khẩu trong nội dung công khai.',
  },
  {
    icon: Phone,
    title: 'Cần chọn cấu hình VPS',
    content: 'Gọi hotline và chuẩn bị thông tin về ứng dụng, hệ điều hành, dung lượng lưu trữ và ngân sách dự kiến.',
  },
  {
    icon: ReceiptText,
    title: 'Nội dung doanh nghiệp',
    content: 'Gửi email info@thuevpsgiare.vn khi cần trao đổi hợp tác hoặc thông tin hành chính.',
  },
];

const mapHref = 'https://maps.app.goo.gl/fvCFRotNYJ4Qne6V9';

export default function ContactPage() {
  return (
    <main>
      <section className="hero-pattern py-16 text-white md:py-20">
        <Container>
          <FadeIn className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-sm font-semibold text-brand-50">
              <MessageSquareText size={16} aria-hidden="true" />
              Liên hệ Fast Byte
            </div>
            <h1 className="text-balance text-white">Chọn đúng kênh, gửi đúng thông tin</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-brand-100 md:text-lg">
              Liên hệ tư vấn qua hotline hoặc email. Với yêu cầu kỹ thuật, Ticket là kênh phù hợp để nội dung được ghi nhận và theo dõi đầy đủ.
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="contact-channels-title">
        <Container>
          <FadeIn className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Kênh liên hệ chính thức</p>
            <h2 id="contact-channels-title" className="mt-3">Bạn cần hỗ trợ theo cách nào?</h2>
          </FadeIn>
          <FadeInStagger className="mt-10 grid gap-5 md:grid-cols-2">
            {contactChannels.map(({ icon: Icon, label, value, description, href, action, external }) => (
              <FadeIn key={label} fullWidth className="h-full">
                <article className="card-hover-effect flex flex-col rounded-2xl border border-line bg-white p-6 shadow-sm md:p-7 h-full">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                      <Icon size={22} aria-hidden="true" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-ink-500">{label}</p>
                      <h3 className="mt-1 break-words text-lg">{value}</h3>
                    </div>
                  </div>
                  <p className="mt-5 flex-1 text-sm leading-6 text-ink-500">{description}</p>
                  <a
                    href={href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group mt-5 inline-flex w-fit items-center gap-2 font-semibold text-brand-700 hover:text-brand-800"
                  >
                    {action}
                    {external ? <ExternalLink size={16} aria-hidden="true" /> : <ArrowRight className="transition-transform group-hover:translate-x-0.5" size={16} aria-hidden="true" />}
                  </a>
                </article>
              </FadeIn>
            ))}
          </FadeInStagger>
        </Container>
      </section>

      <section className="bg-surface-subtle py-16 md:py-20" aria-labelledby="channel-guide-title">
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <FadeIn>
              <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Chuẩn bị trước khi liên hệ</p>
              <h2 id="channel-guide-title" className="mt-3 text-balance">Thông tin đầy đủ giúp xử lý yêu cầu thuận tiện hơn</h2>
              <p className="mt-5 leading-7">
                Hãy dùng email đã đăng ký dịch vụ và nêu rõ mã dịch vụ hoặc IP VPS nếu có. Với lỗi kỹ thuật, nên gửi kèm thời điểm phát sinh và ảnh chụp thông báo lỗi.
              </p>
            </FadeIn>
            <FadeInStagger className="space-y-4">
              {channelGuide.map(({ icon: Icon, title, content }) => (
                <FadeIn key={title} fullWidth>
                  <article className="flex gap-4 rounded-xl border border-line bg-white p-5 shadow-sm">
                    <Icon className="mt-0.5 shrink-0 text-brand-700" size={22} aria-hidden="true" />
                    <div>
                      <h3 className="text-base">{title}</h3>
                      <p className="mt-2 text-sm leading-6 text-ink-500">{content}</p>
                    </div>
                  </article>
                </FadeIn>
              ))}
            </FadeInStagger>
          </div>
        </Container>
      </section>

      <section className="py-16 md:py-20" aria-labelledby="company-contact-title">
        <Container>
          <FadeIn>
            <div className="grid overflow-hidden rounded-2xl border border-line bg-white shadow-md lg:grid-cols-[1fr_0.95fr]">
              <div className="p-7 md:p-10">
                <p className="text-sm font-bold uppercase tracking-[0.14em] text-brand-700">Địa chỉ doanh nghiệp</p>
                <h2 id="company-contact-title" className="mt-3">Công ty TNHH Dữ Liệu Nhanh Fast Byte</h2>
                <dl className="mt-7 space-y-5 text-sm leading-6">
                  <div>
                    <dt className="font-semibold text-ink-900">Địa chỉ</dt>
                    <dd className="mt-1">200 Song Hành, Phường Bình Trưng, TP. Hồ Chí Minh</dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-ink-900">Mã số thuế</dt>
                    <dd className="mt-1">0316985515</dd>
                  </div>
                </dl>
                <Button
                  href={mapHref}
                  target="_blank"
                  variant="outline"
                  size="md"
                  className="mt-7"
                  icon={<ExternalLink size={16} />}
                >
                  Mở trên Google Maps
                </Button>
              </div>
              <div className="flex min-h-[300px] items-center justify-center border-t border-line bg-brand-50 p-8 lg:border-l lg:border-t-0">
                <div className="max-w-sm text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-700 shadow-sm">
                    <MapPin size={30} aria-hidden="true" />
                  </div>
                  <h3 className="mt-5">Văn phòng Fast Byte</h3>
                  <p className="mt-2 text-sm leading-6 text-ink-500">200 Song Hành, Phường Bình Trưng, TP. Hồ Chí Minh</p>
                  <a href={mapHref} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800">
                    Xem chỉ đường <ArrowRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </Container>
      </section>
    </main>
  );
}
