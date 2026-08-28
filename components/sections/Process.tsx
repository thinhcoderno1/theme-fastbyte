import React from 'react';
import { Server, CreditCard, Cpu, KeyRound } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function Process() {
  const steps = [
    {
      step: '01',
      icon: <Server strokeWidth={1.75} size={24} />,
      title: 'Chọn Gói Cấu Hình VPS',
      desc: 'Lựa chọn gói VPS Gold hoặc Hot Deal phù hợp với nhu cầu CPU, RAM và dung lượng NVMe của dự án.',
    },
    {
      step: '02',
      icon: <CreditCard strokeWidth={1.75} size={24} />,
      title: 'Đăng Ký & Thanh Toán',
      desc: 'Điền thông tin và thanh toán tự động quét mã VietQR, VNPAY hoặc ví portal với hóa đơn minh bạch.',
    },
    {
      step: '03',
      icon: <Cpu strokeWidth={1.75} size={24} />,
      title: 'Hệ Thống Khởi Tạo',
      desc: 'Hạ tầng KVM tự động phân bổ tài nguyên phần cứng, cài đặt hệ điều hành và thiết lập IP trong 1–3 phút.',
    },
    {
      step: '04',
      icon: <KeyRound strokeWidth={1.75} size={24} />,
      title: 'Nhận Thông Tin',
      desc: 'Nhận thông tin IPv4 và tài khoản Root qua Email để SSH toàn quyền quản trị và triển khai ứng dụng.',
    },
  ];

  return (
    <section id="quy-trinh" className="py-20 md:py-24 bg-surface-subtle border-y border-line relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Quy Trình Triển Khai"
            title="Quy Trình Đăng Ký Đơn Giản"
            subtitle="Sở hữu máy chủ ảo VPS chất lượng cao chỉ sau 4 bước tinh gọn, bàn giao tài nguyên tức thì."
            align="center"
          />
        </FadeIn>

        <div className="relative">
          {/* Connector Line on Desktop */}
          <div className="hidden lg:block absolute top-[48px] left-[10%] right-[10%] h-[2px] bg-brand-200 z-0" />

          {/* Stepper Grid */}
          <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((item, idx) => (
              <FadeIn key={idx} fullWidth className="h-full">
                <div
                  className="bg-white rounded-lg border border-line p-6 shadow-sm flex flex-col items-center text-center card-hover-effect h-full"
                >
                  {/* Step Circle with Icon */}
                  <div className="relative mb-5">
                    <div className="w-16 h-16 rounded-full bg-brand-700 text-white flex items-center justify-center shadow-sm">
                      {item.icon}
                    </div>
                    <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent-500 text-white text-[11px] font-heading font-extrabold flex items-center justify-center shadow-xs">
                      {idx + 1}
                    </span>
                  </div>

                  <span className="text-[12px] font-semibold text-brand-700 uppercase tracking-widest mb-1.5">
                    Bước {item.step}
                  </span>
                  <h3 className="text-[18px] font-heading font-bold text-ink-900 mb-2.5">
                    {item.title}
                  </h3>
                  <p className="text-[14px] text-ink-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </FadeInStagger>
        </div>
      </Container>
    </section>
  );
}
