import React from 'react';
import { Info, CheckCircle2, Cpu, HardDrive, Wifi } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { BenchmarkImagePreview } from '@/components/ui/BenchmarkImagePreview';
import { BENCHMARK_ITEMS } from '@/lib/data';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function Benchmark() {
  const getIcon = (id: string) => {
    switch (id) {
      case 'bench-sysinfo':
        return <Cpu strokeWidth={1.75} size={20} className="text-brand-700" />;
      case 'bench-dd':
        return <HardDrive strokeWidth={1.75} size={20} className="text-brand-700" />;
      case 'bench-speedtest':
        return <Wifi strokeWidth={1.75} size={20} className="text-brand-700" />;
      default:
        return null;
    }
  };

  return (
    <section id="benchmark" className="py-20 md:py-24 bg-surface-blue border-b border-line relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Kiểm Thử Thực Tế"
            title="Hiệu Suất Máy Chủ VPS Tại ThueVPSGiaRe.vn"
            subtitle="Dữ liệu đo lường trực quan về thông số CPU, tốc độ truy xuất ổ cứng NVMe U.2 và băng thông mạng thực tế."
            align="center"
          />
        </FadeIn>

        {/* 3 Benchmark Cards Grid */}
        <FadeInStagger className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {BENCHMARK_ITEMS.map((item) => (
            <FadeIn key={item.id} fullWidth className="h-full">
              <div
                className="bg-white rounded-lg border border-line overflow-hidden shadow-sm flex flex-col justify-between card-hover-effect h-full"
              >
                <div>
                  <BenchmarkImagePreview
                    src={item.imageUrl}
                    alt={`${item.title} - Benchmark VPS Fast Byte`}
                    metricValue={item.metricValue}
                  />

                  {/* Content Details */}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2.5">
                      <div className="w-8 h-8 rounded-md bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                        {getIcon(item.id)}
                      </div>
                      <div>
                        <span className="text-[12px] font-semibold text-brand-700 uppercase tracking-wider block">
                          {item.metricLabel}
                        </span>
                        <h3 className="text-[18px] font-heading font-bold text-ink-900 leading-tight">
                          {item.title}
                        </h3>
                      </div>
                    </div>

                    <p className="text-[14px] text-ink-500 mb-5 leading-relaxed">
                      {item.summary}
                    </p>

                    <div className="space-y-2 pt-4 border-t border-line text-[13px] text-ink-600">
                      {item.details.map((detail, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 strokeWidth={2} size={15} className="text-emerald-500 shrink-0 mt-0.5" />
                          <span>{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>

        {/* Mandatory Disclaimer Callout */}
        <FadeIn delay={0.15}>
          <div className="bg-white rounded-lg border border-line p-4.5 md:p-5 flex items-start gap-3.5 max-w-3xl mx-auto shadow-xs">
            <Info strokeWidth={2} size={20} className="text-brand-600 shrink-0 mt-0.5" />
            <p className="text-[14px] text-ink-500 leading-relaxed">
              <strong>Lưu ý hiển thị:</strong> Các kết quả được thực hiện trên môi trường ảo hóa nên sẽ có chênh lệch so với benchmark trực tiếp trên máy chủ vật lý.
            </p>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
