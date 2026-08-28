import React from 'react';
import { Headset, ShieldCheck, Terminal, Boxes } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function Benefits() {
  const benefits = [
    {
      icon: <Headset strokeWidth={1.75} size={24} />,
      title: 'Hỗ Trợ 24/7/365',
      description: 'Đội ngũ chuyên viên kỹ thuật túc trực 24/7 sẵn sàng hỗ trợ qua hệ thống Ticket và Hotline, thời gian tiếp nhận xử lý nhanh chóng chỉ trong 15–30 phút.',
      tag: 'Phản hồi nhanh',
    },
    {
      icon: <ShieldCheck strokeWidth={1.75} size={24} />,
      title: 'Uptime 99.9%',
      description: 'Hạ tầng mạng và máy chủ được trang bị cơ chế dự phòng N+1 với thỏa thuận SLA rõ ràng, đảm bảo website và ứng dụng của bạn luôn trực tuyến ổn định.',
      tag: 'Ổn định 24/7',
    },
    {
      icon: <Terminal strokeWidth={1.75} size={24} />,
      title: 'Toàn Quyền Quản Trị',
      description: 'Bạn nhận được quyền quản trị cao nhất (Root Access) trên Linux để thoải mái tùy biến cấu hình hệ thống, cài đặt Docker, web server và mọi gói phần mềm.',
      tag: 'Full Root Access',
    },
    {
      icon: <Boxes strokeWidth={1.75} size={24} />,
      title: 'Tài Nguyên Độc Lập',
      description: 'Công nghệ ảo hóa KVM cô lập tài nguyên phần cứng hoàn toàn. Không bao giờ xảy ra tình trạng chia sẻ RAM hoặc nghẽn CPU do các VPS lân cận.',
      tag: 'Không Oversell',
    },
  ];

  const metrics = [
    { value: '99.9%', label: 'Uptime', desc: 'Hạ tầng chuẩn Tier 3 tại Việt Nam' },
    { value: '24/7', label: 'Support', desc: 'Tiếp nhận qua Ticket & Hotline' },
    { value: '< 1s', label: 'Tốc Độ Phản Hồi Web', desc: 'Nhờ ổ cứng Enterprise NVMe U.2' },
    { value: '5-10 Phút', label: 'Khởi Tạo Tự Động', desc: 'Bàn giao ngay sau khi thanh toán' },
  ];

  return (
    <section id="loi-ich" className="py-20 md:py-24 bg-surface-subtle border-y border-line relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Đặc Quyền Vượt Trội"
            title="Lợi Ích Khi Thuê VPS Giá Rẻ tại ThueVPSGiaRe.vn"
            subtitle="Tối ưu hóa chi phí đầu tư hạ tầng CNTT mà vẫn sở hữu hiệu năng mạnh mẽ cùng sự an tâm tuyệt đối về chất lượng dịch vụ."
            align="center"
          />
        </FadeIn>

        {/* 4 Cards Grid */}
        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, idx) => (
            <FadeIn key={idx} fullWidth className="h-full">
              <FeatureCard
                icon={benefit.icon}
                title={benefit.title}
                description={benefit.description}
                tag={benefit.tag}
              />
            </FadeIn>
          ))}
        </FadeInStagger>

        {/* Metric Stats Strip */}
        <FadeIn delay={0.1}>
          <div className="bg-white rounded-xl border border-line p-8 md:p-10 shadow-xs">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-y lg:divide-y-0 lg:divide-x divide-line">
              {metrics.map((metric, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center text-center ${
                    idx > 0 ? 'pt-6 lg:pt-0 lg:pl-6' : ''
                  }`}
                >
                  <span className="text-[32px] md:text-[40px] font-heading font-extrabold text-brand-700 tracking-tight mb-1">
                    {metric.value}
                  </span>
                  <span className="text-[15px] font-bold text-ink-900 mb-1">
                    {metric.label}
                  </span>
                  <span className="text-[13px] text-ink-400">
                    {metric.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
