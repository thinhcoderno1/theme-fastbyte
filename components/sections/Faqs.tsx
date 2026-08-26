'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle, PhoneCall, LifeBuoy } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FAQS } from '@/lib/data';
import { Button } from '@/components/ui/Button';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

export function Faqs() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleFaq = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Split into 2 columns for desktop
  const col1 = FAQS.slice(0, 8);
  const col2 = FAQS.slice(8, 16);

  // Generate JSON-LD for FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-20 md:py-24 bg-surface relative">
      {/* Schema.org FAQPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Container>
        <FadeIn>
          <SectionHeader
            overline="Hỗ Trợ & Giải Đáp"
            title="Một Số Câu Hỏi Thường Gặp"
            subtitle="Tất cả những thắc mắc thường gặp về hiệu năng phần cứng, chính sách bảo mật, thanh toán và hoàn tiền khi thuê VPS tại Fast Byte."
            align="center"
          />
        </FadeIn>

        {/* 2-column Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start mb-16">
          {/* Column 1 */}
          <FadeInStagger className="space-y-4">
            {col1.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <FadeIn key={item.id} fullWidth>
                  <div
                    className={`bg-surface rounded-lg border transition-all duration-200 overflow-hidden ${
                      isOpen ? 'border-brand-300 shadow-xs' : 'border-line shadow-xs hover:border-brand-200'
                    }`}
                  >
                    <button
                      id={`${item.id}-trigger`}
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-heading font-semibold text-[15px] md:text-[16px] text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-answer`}
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        strokeWidth={2}
                        size={18}
                        className={`text-brand-700 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      id={`${item.id}-answer`}
                      role="region"
                      aria-labelledby={`${item.id}-trigger`}
                      aria-hidden={!isOpen}
                      className={`transition-all duration-200 overflow-hidden ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 pb-5 pt-1 text-[14px] text-ink-500 leading-relaxed border-t border-line/60">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </FadeInStagger>

          {/* Column 2 */}
          <FadeInStagger className="space-y-4">
            {col2.map((item) => {
              const isOpen = !!openItems[item.id];
              return (
                <FadeIn key={item.id} fullWidth>
                  <div
                    className={`bg-surface rounded-lg border transition-all duration-200 overflow-hidden ${
                      isOpen ? 'border-brand-300 shadow-xs' : 'border-line shadow-xs hover:border-brand-200'
                    }`}
                  >
                    <button
                      id={`${item.id}-trigger`}
                      type="button"
                      onClick={() => toggleFaq(item.id)}
                      className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 font-heading font-semibold text-[15px] md:text-[16px] text-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                      aria-expanded={isOpen}
                      aria-controls={`${item.id}-answer`}
                    >
                      <span>{item.question}</span>
                      <ChevronDown
                        strokeWidth={2}
                        size={18}
                        className={`text-brand-700 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <div
                      id={`${item.id}-answer`}
                      role="region"
                      aria-labelledby={`${item.id}-trigger`}
                      aria-hidden={!isOpen}
                      className={`transition-all duration-200 overflow-hidden ${
                        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                      }`}
                    >
                      <div className="px-5 pb-5 pt-1 text-[14px] text-ink-500 leading-relaxed border-t border-line/60">
                        {item.answer}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </FadeInStagger>
        </div>

        {/* Contact Support CTA Box */}
        <FadeIn delay={0.1}>
          <div className="bg-brand-50 rounded-xl border border-brand-100 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-[20px] md:text-[22px] font-heading font-bold text-ink-900 mb-2">
                Bạn vẫn còn câu hỏi chưa được giải đáp?
              </h3>
              <p className="text-[15px] text-ink-600 max-w-xl">
                Đội ngũ kỹ thuật viên của Fast Byte luôn sẵn sàng tư vấn cấu hình VPS tối ưu nhất cho bài toán của bạn 24/7.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3.5 shrink-0">
              <Button
                href="https://id.thuevpsgiare.vn/submitticket.php"
                target="_blank"
                variant="primary"
                size="md"
                icon={<LifeBuoy strokeWidth={1.75} size={16} />}
              >
                Gửi Ticket Hỗ Trợ
              </Button>
              <Button
                href="tel:02873006198"
                variant="outline"
                size="md"
                icon={<PhoneCall strokeWidth={1.75} size={16} />}
              >
                Gọi Hotline 0287 300 6198
              </Button>
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
