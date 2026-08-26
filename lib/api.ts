import 'server-only';

import { BillingCycleKey, BillingCyclePrice, DealPlan, VpsPlan } from './types';

const PORTAL_ORIGIN = 'https://id.thuevpsgiare.vn';
const SPECIAL_DEALS_URL = `${PORTAL_ORIGIN}/store/special-deal-2025`;
const CLOUD_VPS_URL = `${PORTAL_ORIGIN}/store/cloud-vps`;

const CYCLE_DEFINITIONS: Array<{ cycle: BillingCycleKey; label: string; months: number }> = [
  { cycle: 'monthly', label: '1 tháng', months: 1 },
  { cycle: 'quarterly', label: '3 tháng', months: 3 },
  { cycle: 'semiannually', label: '6 tháng', months: 6 },
  { cycle: 'annually', label: '1 năm', months: 12 },
  { cycle: 'biennially', label: '2 năm', months: 24 },
];

const CLOUD_CYCLE_FALLBACKS = [
  [59000, 153000, 252000, 432000, 720000],
  [87000, 222000, 366000, 636000, 1056000],
  [118000, 303000, 498000, 852000, 1416000],
  [180000, 459000, 756000, 1296000, 2160000],
  [286000, 729000, 1206000, 2064000, 3432000],
  [348000, 888000, 1464000, 2508000, 4176000],
  [422000, 1077000, 1776000, 3048000, 5064000],
  [596000, 1521000, 2508000, 4296000, 7152000],
  [744000, 1899000, 3126000, 5364000, 8928000],
  [992000, 2532000, 4170000, 7152000, 11904000],
  [1488000, 3795000, 6252000, 10716000, 17856000],
  [2038000, 5199000, 8562000, 14676000, 24456000],
];

function makeBillingCycles(totals: number[]): BillingCyclePrice[] {
  return CYCLE_DEFINITIONS.map((definition, index) => ({
    ...definition,
    total: totals[index],
  }));
}

interface PortalProduct {
  id: string;
  name: string;
  features: string[];
  price: number;
  billingCycle: string;
  orderUrl: string;
}

// Verified against the portal on 2026-08-25. Used only when the upstream
// request times out, returns an error, or changes its HTML contract.
const FALLBACK_SPECIAL_DEALS: DealPlan[] = [
  ['56', 'Plan C1 - New Year', '2 CPU', '2 GB RAM', '30GB SSD NVMe U.2', 599000],
  ['57', 'Plan C2 - New Year', '2 CPU', '4 GB RAM', '50GB SSD NVMe U.2', 899000],
  ['58', 'Plan C3 - New Year', '4 CPU', '8 GB RAM', '80GB SSD NVMe U.2', 1234000],
  ['59', 'Plan C4 - New Year', '6 CPU', '8 GB RAM', '120GB SSD NVMe U.2', 2222000],
  ['60', 'Plan C5 - New Year', '8 CPU', '16 GB RAM', '180GB SSD NVMe U.2', 4199000],
  ['61', 'Plan C6 - New Year', '16 CPU', '32 GB RAM', '280GB SSD NVMe U.2', 7999000],
].map(([id, name, cpu, ram, disk, price], index) => ({
  id: `deal-${id}`,
  name: String(name),
  badge: index === 1 ? 'Phổ biến nhất' : undefined,
  isPopular: index === 1,
  cpu: String(cpu),
  ram: String(ram),
  disk: String(disk),
  bandwidth: '100 Mbps Net Port · Không giới hạn băng thông',
  ipv4: '1 IPv4 Dùng Riêng',
  priceMonthly: Number(price),
  billingCycle: '1 năm',
  orderUrl: `${SPECIAL_DEALS_URL}/plan-c${String(id === '56' ? 1 : Number(id) - 55)}`,
  stockStatus: 'Tự động khởi tạo',
}));

const FALLBACK_CLOUD_VPS: VpsPlan[] = [
  ['15', 'VPS SSD C1', '1 CPU', '1GB RAM', '20GB SSD NVMe U.2', 59000],
  ['16', 'VPS SSD C2', '1 CPU', '2 GB RAM', '20GB SSD NVMe U.2', 87000],
  ['17', 'VPS SSD C3', '2 CPU', '2 GB RAM', '30GB SSD NVMe U.2', 118000],
  ['18', 'VPS SSD C4', '2 CPU', '4 GB RAM', '50GB SSD NVMe U.2', 180000],
  ['29', 'VPS SSD C5', '4 CPU', '6 GB RAM', '60GB SSD NVMe U.2', 286000],
  ['30', 'VPS SSD C6', '4 CPU', '8 GB RAM', '80GB SSD NVMe U.2', 348000],
  ['32', 'VPS SSD C7', '6 CPU', '8 GB RAM', '120GB SSD NVMe U.2', 422000],
  ['33', 'VPS SSD C8', '8 CPU', '12 GB RAM', '160GB SSD NVMe U.2', 596000],
  ['34', 'VPS SSD C9', '8 CPU', '16 GB RAM', '180GB SSD NVMe U.2', 744000],
  ['35', 'VPS SSD C10', '10 CPU', '22 GB RAM', '240GB SSD NVMe U.2', 992000],
  ['36', 'VPS SSD C11', '16 CPU', '32 GB RAM', '280GB SSD NVMe U.2', 1488000],
  ['37', 'VPS SSD C12', '22 CPU', '48 GB RAM', '320GB SSD NVMe U.2', 2038000],
].map(([id, name, cpu, ram, disk, price], index) => {
  const features = [
    String(cpu),
    String(ram),
    String(disk),
    '1 IPv4 Dùng Riêng',
    '100 Mbps Net Port',
    'Không giới hạn băng thông',
  ];

  return {
    id: `vps-${id}`,
    name: String(name),
    badge: index === 2 ? 'Phổ biến nhất' : undefined,
    isPopular: index === 2,
    cpu: String(cpu),
    ram: String(ram),
    disk: String(disk),
    bandwidth: '100 Mbps Net Port · Không giới hạn băng thông',
    ipv4: '1 IPv4 Dùng Riêng',
    priceMonthly: Number(price),
    orderUrl: `${CLOUD_VPS_URL}/vps-ssd-c${index + 1}`,
    features,
    billingCycles: makeBillingCycles(CLOUD_CYCLE_FALLBACKS[index]),
  };
});

function decodeHtml(value: string): string {
  return value
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, decimal: string) => String.fromCodePoint(Number(decimal)));
}

function cleanHtml(value: string): string {
  return decodeHtml(value.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePrice(value: string): number {
  return Number(value.replace(/\D/g, ''));
}

function parsePortalProducts(html: string): PortalProduct[] {
  const products: PortalProduct[] = [];
  const productPattern = /<div class="product clearfix" id="product(\d+)">([\s\S]*?)<\/footer>\s*<\/div>/gi;

  for (const match of html.matchAll(productPattern)) {
    const [, productId, block] = match;
    const name = block.match(new RegExp(`id="product${productId}-name"[^>]*>([\\s\\S]*?)<\\/span>`, 'i'));
    const pricing = block.match(new RegExp(`id="product${productId}-price"[^>]*>([\\s\\S]*?)<\\/div>`, 'i'));
    const orderLink = block.match(new RegExp(`href="([^"]+)"[^>]*id="product${productId}-order-button"`, 'i'));
    const price = pricing?.[1].match(/([\d.,]+)\s*(?:đ|₫)/i);
    const features = [...block.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map((feature) => cleanHtml(feature[1]))
      .filter(Boolean);

    if (!name || !pricing || !orderLink || !price || features.length === 0) continue;

    const pricingText = cleanHtml(pricing[1]);
    const billingCycle = pricingText.match(/\b\d+\s+(?:tháng|năm)\b/i)?.[0] ?? '';

    products.push({
      id: productId,
      name: cleanHtml(name[1]),
      features,
      price: parsePrice(price[1]),
      billingCycle,
      orderUrl: new URL(decodeHtml(orderLink[1]), PORTAL_ORIGIN).toString(),
    });
  }

  return products;
}

function findFeature(features: string[], pattern: RegExp, fallback: string): string {
  return features.find((feature) => pattern.test(feature)) ?? fallback;
}

async function fetchPortalProducts(url: string): Promise<PortalProduct[]> {
  const response = await fetch(url, {
    headers: {
      Accept: 'text/html,application/xhtml+xml',
      'User-Agent': 'FastByte-VPS-Landing/1.0',
    },
    next: { revalidate: 900 },
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) {
    throw new Error(`Portal returned HTTP ${response.status}`);
  }

  const products = parsePortalProducts(await response.text());
  if (products.length === 0) {
    throw new Error('No products matched the WHMCS HTML contract');
  }

  return products;
}

function extractCookieHeader(setCookie: string | null): string {
  if (!setCookie) return '';

  return [...setCookie.matchAll(/(?:^|,\s*)([A-Za-z][A-Za-z0-9_.-]*=[^;,]*)/g)]
    .map((match) => match[1])
    .join('; ');
}

function parseBillingCycles(html: string): BillingCyclePrice[] {
  const select = html.match(/<select[^>]*id="inputBillingcycle"[\s\S]*?<\/select>/i)?.[0];
  if (!select) return [];

  const prices = new Map<BillingCycleKey, number>();
  for (const option of select.matchAll(/<option\s+value="([^"]+)"[^>]*>\s*([\d.,]+)\s*(?:đ|₫)[\s\S]*?<\/option>/gi)) {
    const cycle = option[1] as BillingCycleKey;
    if (CYCLE_DEFINITIONS.some((definition) => definition.cycle === cycle)) {
      prices.set(cycle, parsePrice(option[2]));
    }
  }

  return CYCLE_DEFINITIONS
    .filter((definition) => prices.has(definition.cycle))
    .map((definition) => ({
      ...definition,
      total: prices.get(definition.cycle)!,
    }));
}

async function fetchProductBillingCycles(orderUrl: string): Promise<BillingCyclePrice[]> {
  const initialResponse = await fetch(orderUrl, {
    headers: { Accept: 'text/html,application/xhtml+xml' },
    redirect: 'manual',
    next: { revalidate: 900 },
    signal: AbortSignal.timeout(8000),
  });

  let response = initialResponse;
  if (initialResponse.status >= 300 && initialResponse.status < 400) {
    const location = initialResponse.headers.get('location');
    if (!location) throw new Error('WHMCS product redirect is missing a location');

    const cookie = extractCookieHeader(initialResponse.headers.get('set-cookie'));
    response = await fetch(new URL(location, orderUrl), {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    });
  }

  if (!response.ok) throw new Error(`Product pricing returned HTTP ${response.status}`);

  const cycles = parseBillingCycles(await response.text());
  if (cycles.length === 0) throw new Error('No billing cycles found for product');
  return cycles;
}

export async function getSpecialDeals(): Promise<DealPlan[]> {
  try {
    const products = await fetchPortalProducts(SPECIAL_DEALS_URL);

    return products.map((product, index) => ({
      id: `deal-${product.id}`,
      name: product.name,
      badge: index === 1 ? 'Phổ biến nhất' : undefined,
      isPopular: index === 1,
      cpu: findFeature(product.features, /\bCPU\b/i, 'CPU theo cấu hình gói'),
      ram: findFeature(product.features, /\bRAM\b/i, 'RAM theo cấu hình gói'),
      disk: findFeature(product.features, /SSD|NVMe/i, 'SSD NVMe U.2'),
      bandwidth: [
        findFeature(product.features, /Net Port/i, '100 Mbps Net Port'),
        findFeature(product.features, /băng thông/i, 'Không giới hạn băng thông'),
      ].join(' · '),
      ipv4: findFeature(product.features, /IPv4/i, '1 IPv4 Dùng Riêng'),
      priceMonthly: product.price,
      billingCycle: product.billingCycle,
      orderUrl: product.orderUrl,
      stockStatus: findFeature(product.features, /Tự động khởi tạo/i, ''),
    }));
  } catch {
    return FALLBACK_SPECIAL_DEALS;
  }
}

export async function getCloudVps(): Promise<VpsPlan[]> {
  try {
    const products = await fetchPortalProducts(CLOUD_VPS_URL);

    return Promise.all(products.map(async (product, index) => {
      let billingCycles = CLOUD_CYCLE_FALLBACKS[index]
        ? makeBillingCycles(CLOUD_CYCLE_FALLBACKS[index])
        : [{ cycle: 'monthly' as const, label: '1 tháng', months: 1, total: product.price }];
      try {
        billingCycles = await fetchProductBillingCycles(product.orderUrl);
      } catch {
        // Keep the verified cycle snapshot for this product only.
      }

      return {
        id: `vps-${product.id}`,
        name: product.name,
        badge: index === 2 ? 'Phổ biến nhất' : undefined,
        isPopular: index === 2,
        cpu: findFeature(product.features, /\bCPU\b/i, 'CPU theo cấu hình gói'),
        ram: findFeature(product.features, /\bRAM\b/i, 'RAM theo cấu hình gói'),
        disk: findFeature(product.features, /SSD|NVMe/i, 'SSD NVMe U.2'),
        bandwidth: [
          findFeature(product.features, /Net Port/i, '100 Mbps Net Port'),
          findFeature(product.features, /băng thông/i, 'Không giới hạn băng thông'),
        ].join(' · '),
        ipv4: findFeature(product.features, /IPv4/i, '1 IPv4 Dùng Riêng'),
        priceMonthly: product.price,
        orderUrl: product.orderUrl,
        features: product.features,
        billingCycles,
      };
    }));
  } catch {
    return FALLBACK_CLOUD_VPS;
  }
}
