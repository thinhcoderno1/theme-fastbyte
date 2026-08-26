import React from 'react';
import { Check } from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { BillingCyclePrice, VpsPlan } from '@/lib/types';

interface PricingCardProps {
  plan: VpsPlan;
  billingCycle: BillingCyclePrice;
}

const formatPrice = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount) + 'đ';

export function PricingCard({ plan, billingCycle }: PricingCardProps) {
  const isMonthly = billingCycle.months === 1;

  return (
    <article
      className={`group relative flex min-h-[500px] flex-col rounded-[24px] bg-white px-7 pb-7 pt-9 transition-[background-color,border-color,box-shadow] duration-200 ease-out md:px-8 md:pb-8 ${
        plan.isPopular
          ? 'border-2 border-brand-500 shadow-[0_14px_35px_rgba(7,16,143,0.12)] hover:border-brand-700 hover:bg-brand-50 hover:shadow-[0_18px_42px_rgba(7,16,143,0.16)]'
          : 'border border-line shadow-sm hover:border-brand-300 hover:bg-brand-50 hover:shadow-[0_14px_34px_rgba(7,16,143,0.10)]'
      }`}
    >
      {plan.badge && (
          <Badge
            variant="brand"
            size="sm"
            className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap !border-brand-500 !bg-brand-500 px-4 py-1.5 font-bold !text-white shadow-sm"
          >
            {plan.badge}
          </Badge>
      )}

      <h3 className="mb-6 text-center text-[21px] font-extrabold uppercase tracking-[-0.02em] text-brand-900 transition-colors duration-200 group-hover:text-brand-700">
        {plan.name}
      </h3>

      <div className="mb-7">
        <div className="flex flex-wrap items-baseline gap-x-1.5">
          <span className="font-heading text-[36px] font-extrabold tracking-tight text-brand-900">
            {formatPrice(billingCycle.total)}
          </span>
          <span className="text-[14px] font-semibold text-ink-500">
            /{isMonthly ? 'tháng' : billingCycle.label}
          </span>
        </div>
      </div>

      <ul className="mb-8 space-y-3.5 text-[14px] text-ink-700">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-500 text-white transition-colors duration-200 group-hover:bg-brand-700">
              <Check strokeWidth={3} size={12} />
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <Button
        href={plan.orderUrl}
        target="_blank"
        variant="primary"
        size="lg"
        className="mt-auto h-[54px] w-full justify-center rounded-md"
      >
        Đăng ký ngay
      </Button>
    </article>
  );
}
