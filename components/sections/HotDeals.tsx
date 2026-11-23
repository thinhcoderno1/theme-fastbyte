'use client';

import React, { useRef, useState } from 'react';
import { Check, Cpu, HardDrive, Headset, ShieldCheck } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { MobilePlanCarousel } from '@/components/ui/MobilePlanCarousel';
import { DealPlan } from '@/lib/types';
import { getPlatinumCyclePrice, getPlatinumOrderUrl, PLATINUM_BILLING_CYCLES } from '@/lib/platinum-pricing';

import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

interface HotDealsProps {
  deals: DealPlan[];
}

const formatPrice = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

const highlights = [
  { label: 'Intel Xeon Platinum', icon: Cpu },
  { label: 'NVMe U.2', icon: HardDrive },
  { label: 'AntiDDoS 50Gbps', icon: ShieldCheck },
  { label: 'Support 24/7', icon: Headset },
];

export function HotDeals({ deals }: HotDealsProps) {
  const [selectedCycle, setSelectedCycle] = useState<(typeof PLATINUM_BILLING_CYCLES)[number]['cycle']>('annually');
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleTabKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    let nextIndex: number;
    switch (event.key) {
      case 'ArrowRight': nextIndex = (index + 1) % PLATINUM_BILLING_CYCLES.length; break;
      case 'ArrowLeft': nextIndex = (index + PLATINUM_BILLING_CYCLES.length - 1) % PLATINUM_BILLING_CYCLES.length; break;
      case 'Home': nextIndex = 0; break;
      case 'End': nextIndex = PLATINUM_BILLING_CYCLES.length - 1; break;
      default: return;
    }
    event.preventDefault();
    setSelectedCycle(PLATINUM_BILLING_CYCLES[nextIndex].cycle);
    tabRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="hot-deals" className="relative bg-surface py-20 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Best Plans"
            title="VPS Platinum Black Friday Giá Rẻ"
            subtitle="Hiệu năng vượt trội đáp ứng mọi nhu cầu."
            align="center"
          />
        </FadeIn>

        <FadeIn delay={0.1} className="mb-10">
          <div
            className="mx-auto grid w-full max-w-3xl grid-cols-3 gap-1 rounded-lg border border-line bg-white p-1.5 shadow-xs"
            role="tablist"
            aria-label="Chu kỳ thanh toán VPS Platinum"
          >
            {PLATINUM_BILLING_CYCLES.map((cycle, index) => (
              <button
                key={cycle.cycle}
                ref={(element) => { tabRefs.current[index] = element; }}
                id={`platinum-tab-${cycle.cycle}`}
                type="button"
                role="tab"
                aria-selected={selectedCycle === cycle.cycle}
                aria-controls="platinum-plans-panel"
                tabIndex={selectedCycle === cycle.cycle ? 0 : -1}
                onClick={() => setSelectedCycle(cycle.cycle)}
                onKeyDown={(event) => handleTabKeyDown(event, index)}
                className={`min-w-0 whitespace-nowrap rounded-md px-3 py-2.5 text-[14px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 sm:px-5 ${
                  selectedCycle === cycle.cycle
                    ? 'bg-brand-700 text-white shadow-sm'
                    : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {cycle.label}
              </button>
            ))}
          </div>
          <ul
            aria-label="Điểm nổi bật VPS Platinum"
            className="mx-auto mt-6 grid max-w-3xl grid-cols-2 gap-x-4 gap-y-4 sm:gap-x-8 lg:grid-cols-4"
          >
            {highlights.map(({ label, icon: Icon }) => (
              <li key={label} className="flex items-center gap-2 text-[13px] font-semibold text-ink-600 sm:justify-center sm:text-sm">
                <Icon className="h-5 w-5 shrink-0 text-brand-700" strokeWidth={1.8} aria-hidden="true" />
                <span>{label}</span>
              </li>
            ))}
          </ul>
        </FadeIn>

        <div
          id="platinum-plans-panel"
          role="tabpanel"
          aria-labelledby={`platinum-tab-${selectedCycle}`}
          tabIndex={0}
          className="rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-4"
        >
          <FadeInStagger amount="some">
            <MobilePlanCarousel
              ariaLabel="Các gói VPS Platinum"
              desktopGridClassName="md:grid-cols-2 md:gap-y-9 lg:grid-cols-3"
            >
              {deals.map((deal) => {
                const specs = deal.features ?? [deal.cpu, deal.ram, deal.disk, deal.ipv4, ...deal.bandwidth.split(' · ')];
                const cyclePrice = getPlatinumCyclePrice(deal, selectedCycle);

                return (
                  <FadeIn key={deal.id} fullWidth className="h-full">
                    <article
                      className={`group relative flex h-full min-h-[470px] flex-col rounded-[24px] bg-white px-7 pb-7 pt-9 transition-[background-color,border-color,box-shadow] duration-200 ease-out md:px-8 md:pb-8 ${
                        deal.isPopular
                          ? 'border-2 border-brand-500 shadow-[0_14px_35px_rgba(7,16,143,0.12)] hover:border-brand-700 hover:bg-brand-50 hover:shadow-[0_18px_42px_rgba(7,16,143,0.16)]'
                          : 'border border-line shadow-sm hover:border-brand-300 hover:bg-brand-50 hover:shadow-[0_14px_34px_rgba(7,16,143,0.10)]'
                      }`}
                    >
                      {deal.badge && (
                        <Badge
                          variant="brand"
                          size="sm"
                          className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap !border-brand-500 !bg-brand-500 px-4 py-1.5 font-bold !text-white shadow-sm"
                        >
                          {deal.badge}
                        </Badge>
                      )}

                      <h3 className="mb-6 text-center text-[21px] font-extrabold uppercase tracking-[-0.02em] text-brand-900 transition-colors duration-200 group-hover:text-brand-700">
                        {deal.name}
                      </h3>

                      <div className="mb-7 min-h-[72px]" aria-live="polite" aria-atomic="true">
                        {cyclePrice ? (
                          <div className="flex flex-wrap items-baseline gap-x-1.5">
                            <span className="font-heading text-[36px] font-extrabold tracking-tight text-brand-900">
                              {formatPrice(cyclePrice.total)}
                            </span>
                            <span className="text-[14px] font-semibold text-ink-500">/{cyclePrice.label}</span>
                          </div>
                        ) : (
                          <p className="text-base font-semibold text-ink-500">Chưa có giá cho chu kỳ này</p>
                        )}
                      </div>

                      <ul className="mb-8 space-y-3.5 text-[14px] text-ink-700">
                        {specs.map((spec, index) => (
                          <li key={`${index}-${spec}`} className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-200 group-hover:bg-brand-700">
                              <Check strokeWidth={3} size={12} />
                            </span>
                            <span>{spec}</span>
                          </li>
                        ))}
                      </ul>

                      <Button
                        href={cyclePrice ? getPlatinumOrderUrl(deal.orderUrl, selectedCycle) : undefined}
                        disabled={!cyclePrice}
                        target="_blank"
                        variant="primary"
                        size="lg"
                        className="mt-auto h-[54px] w-full justify-center rounded-md"
                      >
                        {cyclePrice ? 'Đăng ký ngay' : 'Tạm chưa khả dụng'}
                      </Button>
                    </article>
                  </FadeIn>
                );
              })}
            </MobilePlanCarousel>
          </FadeInStagger>
        </div>
      </Container>
    </section>
  );
}
