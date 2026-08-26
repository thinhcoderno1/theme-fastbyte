import React from 'react';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { DealPlan } from '@/lib/types';

import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

interface HotDealsProps {
  deals: DealPlan[];
}

const formatPrice = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export function HotDeals({ deals }: HotDealsProps) {
  return (
    <section id="hot-deals" className="relative bg-surface py-20 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Best Plans"
            title="Hot Deals VPS Giá Rẻ Cấu Hình Cao"
            subtitle="Gói VPS thanh toán theo năm, gia hạn giữ nguyên giá."
            align="center"
          />
        </FadeIn>

        <FadeInStagger className="grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {deals.map((deal) => {
            const specs = [deal.cpu, deal.ram, deal.disk, deal.ipv4, ...deal.bandwidth.split(' · ')];

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

                  <div className="mb-7">
                    <div className="flex flex-wrap items-baseline gap-x-1.5">
                      <span className="font-heading text-[36px] font-extrabold tracking-tight text-brand-900">
                        {formatPrice(deal.priceMonthly)}
                      </span>
                      <span className="text-[14px] font-semibold text-ink-500">/{deal.billingCycle || 'chu kỳ'}</span>
                    </div>
                  </div>

                  <ul className="mb-8 space-y-3.5 text-[14px] text-ink-700">
                    {specs.map((spec) => (
                      <li key={spec} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-200 group-hover:bg-brand-700">
                          <Check strokeWidth={3} size={12} />
                        </span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href={deal.orderUrl}
                    target="_blank"
                    variant="primary"
                    size="lg"
                    className="mt-auto h-[54px] w-full justify-center rounded-md"
                  >
                    Đăng ký ngay
                  </Button>
                </article>
              </FadeIn>
            );
          })}
        </FadeInStagger>
      </Container>
    </section>
  );
}
