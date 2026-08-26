import React from 'react';
import { Terminal, CheckCircle2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { OS_DISTROS } from '@/lib/data';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function OsSupport() {
  return (
    <section id="os" className="py-20 md:py-24 bg-surface relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Hệ Điều Hành Hỗ Trợ"
            title="Hỗ Trợ Đa Dạng Các Hệ Điều Hành"
            subtitle="Tự do lựa chọn và cài đặt lại hệ điều hành Linux 64-bit tự động 100% trong vòng 2 phút trực tiếp trên trang quản lý."
            align="center"
          />
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {OS_DISTROS.map((os) => (
            <FadeIn key={os.id} fullWidth className="h-full">
              <div
                className="bg-surface rounded-lg border border-line p-6 shadow-sm card-hover-effect flex flex-col justify-between group h-full"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center border border-brand-100 group-hover:bg-brand-700 group-hover:text-white transition-colors duration-200">
                      <Terminal strokeWidth={2} size={24} />
                    </div>
                    <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-pill">
                      {os.tag}
                    </span>
                  </div>

                  <h3 className="text-[19px] font-heading font-bold text-ink-900 mb-2">
                    {os.name}
                  </h3>
                  <p className="text-[13px] text-ink-500 mb-5 leading-relaxed">
                    {os.description}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-400 block mb-2.5">
                    Phiên bản x86_64 có sẵn:
                  </span>
                  <div className="space-y-1.5">
                    {os.versions.map((ver, idx) => (
                      <div
                        key={idx}
                        className="text-[13px] text-ink-700 bg-surface-subtle border border-line/80 px-2.5 py-1 rounded-sm flex items-center gap-2"
                      >
                        <CheckCircle2 strokeWidth={2} size={13} className="text-emerald-600 shrink-0" />
                        <span className="font-mono text-[12px]">{ver}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </section>
  );
}
