'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { Star, Quote } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FEEDBACKS } from '@/lib/data';
import { FadeIn } from '@/components/ui/FadeIn';

export function Feedbacks() {
  const [emblaRef] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: true,
    },
    [
      AutoScroll({
        speed: 0.8,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ]
  );

  return (
    <section id="feedback" className="py-20 md:py-24 bg-surface overflow-hidden relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Đánh Giá Khách Hàng"
            title="Khách Hàng Nói Gì Về ThueVPSGiaRe.vn"
            subtitle="Hơn 10.000+ cá nhân và doanh nghiệp tin tưởng triển khai hạ tầng website và ứng dụng trên hệ thống VPS của Fast Byte."
            align="center"
          />
        </FadeIn>
      </Container>

      {/* Infinite AutoScroll Slider Container */}
      <FadeIn delay={0.1} className="w-full relative py-4">
        {/* Left and Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-surface to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-surface to-transparent z-10 pointer-events-none" />

        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-6 pl-6">
            {FEEDBACKS.map((fb) => (
              <div
                key={fb.id}
                className="shrink-0 w-[320px] sm:w-[380px] bg-white rounded-lg border border-line p-6 shadow-sm flex flex-col justify-between select-none card-hover-effect"
              >
                <div>
                  {/* Star Rating & Quote Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star
                          key={i}
                          strokeWidth={1.5}
                          size={16}
                          className="text-amber-500 fill-amber-400"
                        />
                      ))}
                    </div>
                    <Quote strokeWidth={1.5} size={22} className="text-brand-200" />
                  </div>

                  {/* Feedback Body */}
                  <p className="text-[14px] text-ink-600 leading-relaxed italic mb-6">
                    &ldquo;{fb.content}&rdquo;
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-line/80">
                  <div className="w-10 h-10 rounded-full bg-brand-700 text-white font-heading font-bold text-[14px] flex items-center justify-center shrink-0 shadow-xs">
                    {fb.avatarText}
                  </div>
                  <div>
                    <h4 className="text-[15px] font-heading font-bold text-ink-900 leading-tight">
                      {fb.name}
                    </h4>
                    <p className="text-[12px] text-ink-500">
                      {fb.role} {fb.company ? `• ${fb.company}` : ''}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
