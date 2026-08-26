export interface VpsPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  cpu: string;
  ram: string;
  disk: string;
  bandwidth: string;
  ipv4: string;
  priceMonthly: number;
  priceOriginal?: number;
  discountPercent?: number;
  orderUrl: string;
  features: string[];
  billingCycles?: BillingCyclePrice[];
}

export type BillingCycleKey = 'monthly' | 'quarterly' | 'semiannually' | 'annually' | 'biennially';

export interface BillingCyclePrice {
  cycle: BillingCycleKey;
  label: string;
  months: number;
  total: number;
}

export interface DealPlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  cpu: string;
  ram: string;
  disk: string;
  bandwidth: string;
  ipv4: string;
  priceMonthly: number;
  priceOriginal?: number;
  discountPercent?: number;
  billingCycle?: string;
  orderUrl: string;
  stockStatus?: string;
}

export interface Feedback {
  id: string;
  name: string;
  role: string;
  company?: string;
  rating: number;
  content: string;
  avatarText: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface OsDistro {
  id: string;
  name: string;
  tag: string;
  versions: string[];
  description: string;
}

export interface Partner {
  id: string;
  name: string;
  type: string;
  logoId: string;
}

export interface BenchmarkItem {
  id: string;
  title: string;
  imageUrl: string;
  metricLabel: string;
  metricValue: string;
  summary: string;
  details: string[];
}
