import 'server-only';

import { unstable_cache } from 'next/cache';
import { BillingCycleKey, BillingCyclePrice, DealPlan, VpsPlan } from './types';

const PORTAL_ORIGIN = 'https://id.thuevpsgiare.vn';
const PLATINUM_DEALS_URL = `${PORTAL_ORIGIN}/store/promo-blackfriday26`;
const VPS_LITE_URL = `${PORTAL_ORIGIN}/store/vps-gia-re`;

const CYCLE_DEFINITIONS: Array<{ cycle: BillingCycleKey; label: string; months: number }> = [
  { cycle: 'monthly', label: '1 tháng', months: 1 },
  { cycle: 'quarterly', label: '3 tháng', months: 3 },
  { cycle: 'semiannually', label: '6 tháng', months: 6 },
  { cycle: 'annually', label: '1 năm', months: 12 },
  { cycle: 'biennially', label: '2 năm', months: 24 },
  { cycle: 'triennially', label: '3 năm', months: 36 },
];

interface PortalProduct {
  id: string;
  name: string;
  features: string[];
  price: number;
  billingCycle: string;
  orderUrl: string;
}

// Platinum snapshot verified against the portal on 2026-11-23. Used when the upstream
// request times out, returns an error, or changes its HTML contract.
const FALLBACK_PLATINUM_DEALS: DealPlan[] = [
  ['75', 2, 2, 30, 799000, 1438200, 2037450],
  ['76', 2, 4, 50, 1199000, 2158200, 3057450],
  ['77', 4, 8, 80, 1634000, 2941200, 4166700],
  ['78', 6, 8, 120, 2722000, 4899600, 6941100],
  ['79', 8, 16, 180, 4799000, 8638200, 12237450],
  ['80', 16, 32, 280, 8699000, 15658200, 22182450],
].map(([id, cpu, ram, disk, price, biennialPrice, triennialPrice], index) => {
  const features = [
    `${cpu} CPU Intel Xeon Platinum`,
    `${ram} GB RAM`,
    `${disk}GB SSD NVMe U.2`,
    '01 IPv4 Public',
    '200 Mbps Net Port',
    'Không giới hạn băng thông',
    'Anti DDoS 50Gbps',
    'Tự động khởi tạo',
    'Full quyền quản trị',
    'Gia hạn giữ nguyên giá',
  ];

  return {
    id: `deal-${id}`,
    name: `BF26 PLATINUM ${index + 1}`,
    badge: index === 1 ? 'Phổ biến nhất' : undefined,
    isPopular: index === 1,
    cpu: features[0],
    ram: features[1],
    disk: features[2],
    bandwidth: features.slice(4, 6).join(' · '),
    ipv4: features[3],
    priceMonthly: Number(price),
    billingCycle: '1 năm',
    orderUrl: `${PLATINUM_DEALS_URL}/bf26-platinum-${index + 1}`,
    stockStatus: features[7],
    features,
    billingCycles: CYCLE_DEFINITIONS.filter((definition) => definition.months >= 12)
      .map((definition, cycleIndex) => ({
        ...definition,
        total: Number([price, biennialPrice, triennialPrice][cycleIndex]),
      })),
  };
});

// Catalog and checkout totals verified on 2026-11-26.
const FALLBACK_VPS_LITE: VpsPlan[] = ([
  ['81', 1, '1GB', 20, [89000, 229000, 379000, 649000, 1089000]],
  ['82', 1, '2 GB', 20, [130000, 330000, 549000, 959000, 1629000]],
  ['83', 2, '2 GB', 30, [170000, 460000, 749000, 1279000, 2129000]],
  ['84', 2, '4 GB', 50, [270000, 689000, 1130000, 1949000, 3249000]],
  ['85', 4, '6 GB', 60, [430000, 1099000, 1800000, 3099000, 5149000]],
  ['86', 4, '8 GB', 80, [529000, 1330000, 2199000, 3769000, 6269000]],
  ['87', 6, '8 GB', 120, [630000, 1600000, 2669000, 4579000, 7599000]],
  ['88', 8, '12 GB', 160, [899000, 2280000, 3769000, 6449000, 10729000]],
  ['89', 8, '16 GB', 180, [1110000, 2849000, 4689000, 8049000, 13399000]],
  ['90', 10, '22 GB', 240, [1489000, 3799000, 6259000, 10729000, 17859000]],
  ['91', 16, '32 GB', 280, [2239000, 5699000, 9379000, 16079000, 26784000]],
  ['92', 22, '48 GB', 320, [3059000, 7799000, 12849000, 22019000, 36689000]],
] as const).map(([id, cpu, ram, disk, totals], index) => {
  const features = [
    `${cpu} CPU`,
    `${ram} RAM`,
    `${disk}GB SSD NVMe U.2`,
    '1 IPv4 Public',
    '100 Mbps Net Port',
    'Không giới hạn băng thông',
  ];

  return makeVpsLitePlan({
    id,
    name: `VPS Lite ${index + 1}`,
    orderUrl: `${VPS_LITE_URL}/vps-lite-${index + 1}`,
    features,
  }, totals.map((total, cycleIndex) => ({ ...CYCLE_DEFINITIONS[cycleIndex], total })));
});

function makeVpsLitePlan(
  product: Pick<PortalProduct, 'id' | 'name' | 'orderUrl' | 'features'>,
  billingCycles: BillingCyclePrice[],
): VpsPlan {
  const { id, name, orderUrl, features } = product;
  const monthly = billingCycles.find((cycle) => cycle.cycle === 'monthly');
  if (!monthly) throw new Error('VPS Lite product has no monthly price');

  return {
    id: `vps-${id}`,
    name,
    orderUrl,
    features,
    cpu: findFeature(features, /\bCPU\b/i, ''),
    ram: findFeature(features, /\bRAM\b/i, ''),
    disk: findFeature(features, /SSD|NVMe/i, ''),
    bandwidth: features.filter((feature) => /Net Port|băng thông/i.test(feature)).join(' · '),
    ipv4: findFeature(features, /IPv4/i, ''),
    priceMonthly: monthly.total,
    billingCycles,
  };
}

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

function parseFeatures(html: string): string[] {
  return [...new Set([...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map((feature) => cleanHtml(feature[1]))
    .filter(Boolean))];
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
    const features = parseFeatures(block);

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
    const total = parsePrice(option[2]);
    if (total > 0 && Number.isFinite(total) && CYCLE_DEFINITIONS.some((definition) => definition.cycle === cycle)) {
      prices.set(cycle, total);
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
    cache: 'no-store',
    signal: AbortSignal.timeout(8000),
  });

  let response = initialResponse;
  if (initialResponse.status >= 300 && initialResponse.status < 400) {
    const location = initialResponse.headers.get('location');
    if (!location) throw new Error('WHMCS product redirect is missing a location');

    const checkoutUrl = new URL(location, orderUrl);
    if (checkoutUrl.origin !== PORTAL_ORIGIN) throw new Error('Unexpected WHMCS checkout origin');

    const cookie = extractCookieHeader(initialResponse.headers.get('set-cookie'));
    response = await fetch(checkoutUrl, {
      headers: {
        Accept: 'text/html,application/xhtml+xml',
        ...(cookie ? { Cookie: cookie } : {}),
      },
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
  }

  if (!response.ok) throw new Error(`Product pricing returned HTTP ${response.status}`);

  const cycles = parseBillingCycles(await response.text());
  if (cycles.length === 0) throw new Error('No billing cycles found for product');
  return cycles;
}

// Cache parsed prices by product URL, rather than by the temporary WHMCS session
// cookie used during the order-page redirect. No customer session is involved.
const fetchPlatinumBillingCycles = unstable_cache(
  async (orderUrl: string) => {
    const cycles = (await fetchProductBillingCycles(orderUrl)).filter((cycle) => cycle.months >= 12);
    if (cycles.length === 0) throw new Error('No annual Platinum billing cycles found');
    return cycles;
  },
  ['platinum-billing-cycles-v1'],
  { revalidate: 900 },
);

export async function getPlatinumDeals(): Promise<DealPlan[]> {
  try {
    // The public WHMCS storefront exposes current prices without API credentials.
    // Keep this request server-side and share the 15-minute Next.js fetch cache.
    const products = (await fetchPortalProducts(PLATINUM_DEALS_URL))
      .filter((product) => /\bplatinum\b/i.test(product.name));

    if (products.length === 0 || products.some((product) => (
      !Number.isFinite(product.price) || product.price <= 0 || !product.billingCycle
      || !product.features.some((feature) => /\bCPU\b/i.test(feature))
      || !product.features.some((feature) => /\bRAM\b/i.test(feature))
      || !product.features.some((feature) => /SSD|NVMe/i.test(feature))
      || !product.orderUrl.startsWith(`${PLATINUM_DEALS_URL}/`)
    ))) {
      throw new Error('Portal returned incomplete Platinum product data');
    }

    return await Promise.all(products.map(async (product, index) => {
      // Match a snapshot by product ID and current annual price. Never invent a
      // multi-year price by multiplying the annual total or reusing another SKU.
      const snapshot = FALLBACK_PLATINUM_DEALS.find((deal) => deal.id === `deal-${product.id}`);
      let billingCycles: BillingCyclePrice[] = product.billingCycle === '1 năm' ? [{
        cycle: 'annually', label: '1 năm', months: 12, total: product.price,
      }] : [];
      try {
        billingCycles = await fetchPlatinumBillingCycles(product.orderUrl);
      } catch {
        if (product.billingCycle === '1 năm' && snapshot?.priceMonthly === product.price) {
          billingCycles = snapshot.billingCycles ?? billingCycles;
        }
        console.warn(`[portal] Platinum billing cycles unavailable for product ${product.id}; using verified prices where available.`);
      }

      return {
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
        features: product.features,
        billingCycles,
      };
    }));
  } catch {
    console.warn('[portal] Platinum pricing unavailable; using the 2026-11-23 snapshot.');
    return FALLBACK_PLATINUM_DEALS;
  }
}

interface WhmcsProduct {
  pid: string | number;
  gid: string | number;
  name: string;
  description: string;
  'product-url'?: string;
  product_url?: string;
  pricing?: { VND?: Partial<Record<BillingCycleKey, string | number>> };
}

const fetchVpsLiteApi = unstable_cache(
  async (groupId: string): Promise<VpsPlan[]> => {
    const response = await fetch(`${PORTAL_ORIGIN}/includes/api.php`, {
      method: 'POST',
      body: new URLSearchParams({
        action: 'GetProducts',
        responsetype: 'json',
        identifier: process.env.WHMCS_API_IDENTIFIER!,
        secret: process.env.WHMCS_API_SECRET!,
        gid: groupId,
      }),
      headers: { Accept: 'application/json' },
      redirect: 'error',
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`WHMCS API returned HTTP ${response.status}`);
    const payload: { result?: string; products?: { product?: WhmcsProduct[] } } = await response.json();
    const products = payload.products?.product;
    if (payload.result !== 'success' || !Array.isArray(products) || products.length === 0) {
      throw new Error('WHMCS API did not return a VPS Lite catalog');
    }

    return products.map((product) => {
      const id = String(product.pid);
      const name = cleanHtml(product.name);
      const features = parseFeatures(product.description);
      if (!/^\d+$/.test(id) || String(product.gid) !== groupId || !name || features.length === 0) {
        throw new Error('WHMCS API returned an invalid VPS Lite product');
      }

      const productUrl = product['product-url'] || product.product_url;
      const orderUrl = productUrl
        ? new URL(productUrl, PORTAL_ORIGIN).toString()
        : `${PORTAL_ORIGIN}/cart.php?a=add&pid=${id}`;
      if (productUrl && !orderUrl.startsWith(`${VPS_LITE_URL}/`)) {
        throw new Error('WHMCS API product URL is outside the VPS Lite catalog');
      }

      const pricing = product.pricing?.VND;
      const cycles = CYCLE_DEFINITIONS.flatMap((definition) => {
        const total = Number(pricing?.[definition.cycle]);
        return Number.isFinite(total) && total > 0 ? [{ ...definition, total }] : [];
      });

      return makeVpsLitePlan({ id, name, orderUrl, features }, cycles);
    });
  },
  ['vps-lite-api-v1'],
  { revalidate: 900 },
);

const fetchVpsLiteBillingCycles = unstable_cache(
  fetchProductBillingCycles,
  ['vps-lite-billing-cycles-v1'],
  { revalidate: 900 },
);

export async function getVpsLite(): Promise<VpsPlan[]> {
  const groupId = process.env.WHMCS_VPS_LITE_GROUP_ID?.trim();
  if (groupId && /^\d+$/.test(groupId) && process.env.WHMCS_API_IDENTIFIER && process.env.WHMCS_API_SECRET) {
    try {
      return await fetchVpsLiteApi(groupId);
    } catch {
      console.warn('[portal] WHMCS VPS Lite API unavailable; using the public storefront.');
    }
  }

  try {
    const products = await fetchPortalProducts(VPS_LITE_URL);
    if (products.some((product) => (
      !product.name || !Number.isFinite(product.price) || product.price <= 0
      || product.billingCycle !== '1 tháng' || !product.orderUrl.startsWith(`${VPS_LITE_URL}/`)
    ))) {
      throw new Error('Portal returned incomplete VPS Lite product data');
    }

    return await Promise.all(products.map(async (product) => {
      const monthly = { ...CYCLE_DEFINITIONS[0], total: product.price };
      let billingCycles: BillingCyclePrice[];
      try {
        const checkoutCycles = await fetchVpsLiteBillingCycles(product.orderUrl);
        billingCycles = checkoutCycles.some((cycle) => cycle.cycle === 'monthly')
          ? checkoutCycles
          : [monthly, ...checkoutCycles];
      } catch {
        const snapshot = FALLBACK_VPS_LITE.find((plan) => (
          plan.id === `vps-${product.id}` && plan.orderUrl === product.orderUrl && plan.priceMonthly === product.price
        ));
        billingCycles = snapshot?.billingCycles ?? [monthly];
        console.warn(`[portal] VPS Lite billing cycles unavailable for product ${product.id}.`);
      }
      return makeVpsLitePlan(product, billingCycles);
    }));
  } catch {
    console.warn('[portal] VPS Lite pricing unavailable; using the 2026-11-26 snapshot.');
    return FALLBACK_VPS_LITE;
  }
}
