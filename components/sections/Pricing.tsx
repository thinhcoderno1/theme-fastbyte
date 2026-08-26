'use client';

import React, { useState } from 'react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { PricingCard } from '@/components/ui/PricingCard';
import { BillingCycleKey, BillingCyclePrice, VpsPlan } from '@/lib/types';
import { FadeIn, FadeInStagger } from '@/components/ui/FadeIn';

interface PricingProps {
  plans: VpsPlan[];
}

export function Pricing({ plans }: PricingProps) {
  const cycles = plans[0]?.billingCycles ?? [];
  const [selectedCycle, setSelectedCycle] = useState<BillingCycleKey>('monthly');

  const getCyclePrice = (plan: VpsPlan): BillingCyclePrice => (
    plan.billingCycles?.find((cycle) => cycle.cycle === selectedCycle)
    ?? plan.billingCycles?.[0]
    ?? { cycle: 'monthly', label: '1 tháng', months: 1, total: plan.priceMonthly }
  );

  return (
    <section id="bang-gia" className="relative border-y border-line bg-surface-subtle py-20 md:py-24">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Pricing Table"
            title="Bảng Giá Thuê VPS Giá Rẻ 2026"
            subtitle="Chọn chu kỳ để xem đúng tổng tiền và đơn giá quy đổi theo tháng."
            align="center"
          />
        </FadeIn>

        {cycles.length > 0 && (
          <FadeIn delay={0.1} className="mb-10 overflow-x-auto pb-1">
            <div
              className="mx-auto flex w-max min-w-full justify-start gap-1 rounded-lg border border-line bg-white p-1.5 shadow-xs sm:min-w-0 sm:justify-center"
              role="tablist"
              aria-label="Chu kỳ thanh toán"
            >
              {cycles.map((cycle) => (
                <button
                  key={cycle.cycle}
                  type="button"
                  role="tab"
                  aria-selected={selectedCycle === cycle.cycle}
                  onClick={() => setSelectedCycle(cycle.cycle)}
                  className={`whitespace-nowrap rounded-md px-4 py-2 text-[13px] font-semibold transition-colors ${
                    selectedCycle === cycle.cycle
                      ? 'bg-brand-700 text-white shadow-sm'
                      : 'text-ink-600 hover:bg-brand-50 hover:text-brand-700'
                  }`}
                >
                  {cycle.label}
                </button>
              ))}
            </div>
          </FadeIn>
        )}

        <FadeInStagger className="grid grid-cols-1 gap-x-5 gap-y-9 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <FadeIn key={plan.id} fullWidth className="h-full">
              <PricingCard
                plan={plan}
                billingCycle={getCyclePrice(plan)}
              />
            </FadeIn>
          ))}
        </FadeInStagger>
      </Container>
    </section>
  );
}
