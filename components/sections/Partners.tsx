'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Container } from '@/components/ui/Container';
import { PartnerLogo } from '@/components/ui/PartnerLogo';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PARTNERS } from '@/lib/data';
import { FadeIn } from '@/components/ui/FadeIn';

export function Partners() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 0.7,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <section id="doi-tac" className="py-16 md:py-20 bg-surface-subtle border-y border-line overflow-hidden relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Đối Tác & Công Nghệ"
            title="Đối Tác Của Thuê VPS Giá Rẻ Fast Byte"
            subtitle="Hệ sinh thái công nghệ, nền tảng ảo hóa và phần cứng máy chủ được Fast Byte hỗ trợ trong quá trình vận hành dịch vụ."
            align="center"
          />
        </FadeIn>
      </Container>

      {/* Infinite Logo Slider */}
      <FadeIn delay={0.1} className="w-full relative py-2">
        {/* Left and Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface-subtle to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface-subtle to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4 pl-5 md:gap-5 md:pl-6">
            {PARTNERS.map((partner) => (
              <div
                key={partner.id}
                className="flex h-[104px] w-[190px] shrink-0 select-none flex-col items-center justify-center rounded-lg border border-line bg-white px-4 py-3 text-center shadow-xs transition-all duration-200 hover:border-brand-300 hover:shadow-sm md:w-[208px]"
              >
                <PartnerLogo logoId={partner.logoId} name={partner.name} />
                <span className="mt-2 font-heading text-[13px] font-bold tracking-tight text-ink-900">
                  {partner.name}
                </span>
                <span className="mt-0.5 text-[10px] text-ink-400">
                  {partner.type}
                </span>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
