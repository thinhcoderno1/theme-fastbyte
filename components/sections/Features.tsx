import React from 'react';
import { Cpu, HardDrive, Infinity as InfinityIcon, Globe, Building2, Network } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FeatureCard } from '@/components/ui/FeatureCard';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function Features() {
  const features = [
    {
      icon: <Cpu strokeWidth={1.75} size={24} />,
      title: 'CPU Intel® Xeon® Gold',
      description: 'Trang bị các dòng vi xử lý Intel Xeon Gold chuyên dụng cho máy chủ doanh nghiệp với xung nhịp cao và công nghệ đa luồng mạnh mẽ.',
      tag: 'Hiệu năng cao',
    },
    {
      icon: <HardDrive strokeWidth={1.75} size={24} />,
      title: 'Ổ Cứng SSD NVMe U.2',
      description: 'Sử dụng dòng ổ cứng chuẩn Enterprise PCIe NVMe U.2 cho tốc độ đọc ghi lên đến 2.000 MB/s, phản hồi tức thì mọi thao tác cơ sở dữ liệu.',
      tag: 'Tốc độ siêu tốc',
    },
    {
      icon: <InfinityIcon strokeWidth={1.75} size={24} />,
      title: 'Unlimited Bandwidth',
      description: 'Lưu lượng băng thông truyền tải dữ liệu hoàn toàn không giới hạn, giúp doanh nghiệp thoải mái đón nhận hàng triệu lượt truy cập mỗi tháng.',
      tag: 'Không lo giới hạn',
    },
    {
      icon: <Globe strokeWidth={1.75} size={24} />,
      title: '01 IPv4 Riêng',
      description: 'Mỗi VPS được gán một địa chỉ IPv4 riêng chuyên dụng, độ uy tín IP cao giúp gửi email an toàn và vận hành website ổn định.',
      tag: 'Dedicated IP',
    },
    {
      icon: <Building2 strokeWidth={1.75} size={24} />,
      title: 'Datacenter Chuẩn Tier 3 VN',
      description: 'Máy chủ đặt tại các trung tâm dữ liệu hàng đầu Việt Nam (Viettel IDC, VNPT) với nguồn điện kép dự phòng và điều hòa chính xác.',
      tag: 'Độ trễ cực thấp',
    },
    {
      icon: <Network strokeWidth={1.75} size={24} />,
      title: 'Cổng Mạng 100 Mbps Ổn Định',
      description: 'Kết nối mạng tốc độ cao chuẩn 100 Mbps trực tiếp vào hạ tầng mạng lõi viễn thông, đảm bảo thông suốt ngay cả khi đứt cáp quang biển.',
      tag: 'Đường truyền ổn định',
    },
  ];

  return (
    <section id="ha-tang" className="py-20 md:py-24 bg-surface relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Hạ Tầng Công Nghệ"
            title="Nền Tảng Hạ Tầng VPS Giá Rẻ tại ThueVPSGiaRe.vn"
            subtitle="Đầu tư đồng bộ vào hệ thống phần cứng chuyên dụng cấp Enterprise nhằm đem lại độ ổn định tối đa cho ứng dụng của bạn."
            align="center"
          />
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <FadeIn key={idx} fullWidth className="h-full">
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                tag={feature.tag}
              />
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </section>
  );
}
