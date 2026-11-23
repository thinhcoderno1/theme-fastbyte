import type { BillingCycleKey, BillingCyclePrice, DealPlan } from './types';

export const PLATINUM_BILLING_CYCLES = [
  { cycle: 'annually', label: '1 năm' },
  { cycle: 'biennially', label: '2 năm' },
  { cycle: 'triennially', label: '3 năm' },
] as const;

export function getPlatinumCyclePrice(deal: DealPlan, cycle: BillingCycleKey): BillingCyclePrice | undefined {
  if (deal.billingCycles) return deal.billingCycles.find((price) => price.cycle === cycle);
  if (cycle === 'annually' && deal.billingCycle === '1 năm') {
    return { cycle: 'annually', label: '1 năm', months: 12, total: deal.priceMonthly };
  }
}

export function getPlatinumOrderUrl(orderUrl: string, cycle: BillingCycleKey): string {
  const url = new URL(orderUrl);
  url.searchParams.set('billingcycle', cycle);
  return url.toString();
}
