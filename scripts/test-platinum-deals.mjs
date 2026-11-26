import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';
import * as React from 'react';
import * as jsxRuntime from 'react/jsx-runtime';

const portalUrl = 'https://id.thuevpsgiare.vn/store/promo-blackfriday26';
const vpsLiteUrl = 'https://id.thuevpsgiare.vn/store/vps-gia-re';
const whmcsApiUrl = 'https://id.thuevpsgiare.vn/includes/api.php';
const fixture = await readFile(new URL('./fixtures/platinum-store.html', import.meta.url), 'utf8');
const cycleFixtures = JSON.parse(await readFile(new URL('./fixtures/platinum-cycles.json', import.meta.url), 'utf8'));
const source = await readFile(new URL('../lib/api.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
});

// Exercise the real server loader without booting Next.js or contacting the portal.
function loadApi(fetchImplementation, fetchCycles = async (url) => {
  const planNumber = String(url).match(/bf26-platinum-(\d+)/)?.[1];
  const html = cycleFixtures[74 + Number(planNumber)];
  return html ? new Response(html) : new Response('Unavailable', { status: 503 });
}, env = {}) {
  const exports = {};
  const warnings = [];
  vm.runInNewContext(outputText, {
    exports,
    require(name) {
      if (name === 'next/cache') return {
        unstable_cache(fn, keys, options) {
          assert.equal(options.revalidate, 900);
          assert.match(keys[0], /^(platinum-billing-cycles|vps-lite-api|vps-lite-billing-cycles)-v1$/);
          return fn;
        },
      };
      assert.equal(name, 'server-only');
      return {};
    },
    fetch: (url, options) => [portalUrl, vpsLiteUrl, whmcsApiUrl].includes(url)
      ? fetchImplementation(url, options)
      : fetchCycles(url, options),
    URL,
    URLSearchParams,
    AbortSignal,
    process: { env },
    console: { warn: (message) => warnings.push(message) },
  });
  return { getDeals: exports.getPlatinumDeals, getVpsLite: exports.getVpsLite, warnings };
}

test('loads all six portal plans with annual totals, full benefits and correct order URLs', async () => {
  const { getDeals, warnings } = loadApi(async (url, options) => {
    assert.equal(url, portalUrl);
    assert.equal(options.next.revalidate, 900);
    assert.ok(options.signal instanceof AbortSignal);
    return new Response(fixture);
  });
  const deals = await getDeals();
  assert.equal(deals.length, 6);
  assert.deepEqual(Array.from(deals, (deal) => deal.priceMonthly), [799000, 1199000, 1634000, 2722000, 4799000, 8699000]);
  const expectedTotals = [
    [799000, 1438200, 2037450], [1199000, 2158200, 3057450],
    [1634000, 2941200, 4166700], [2722000, 4899600, 6941100],
    [4799000, 8638200, 12237450], [8699000, 15658200, 22182450],
  ];
  for (const [index, deal] of deals.entries()) {
    assert.equal(deal.id, `deal-${75 + index}`);
    assert.equal(deal.name, `BF26 PLATINUM ${index + 1}`);
    assert.equal(deal.billingCycle, '1 năm');
    assert.equal(deal.orderUrl, `${portalUrl}/bf26-platinum-${index + 1}`);
    assert.equal(deal.features.length, 10);
    assert.ok(deal.features.includes('200 Mbps Net Port'));
    assert.ok(deal.features.includes('Anti DDoS 50Gbps'));
    assert.ok(deal.features.includes('Gia hạn giữ nguyên giá'));
    assert.deepEqual(Array.from(deal.billingCycles, (cycle) => cycle.total), expectedTotals[index]);
    assert.deepEqual(Array.from(deal.billingCycles, (cycle) => cycle.cycle), ['annually', 'biennially', 'triennially']);
  }
  assert.equal(warnings.length, 0);
});

test('reflects changed prices, features, names and added or removed Platinum plans', async () => {
  const firstCard = fixture.match(/<div class="product clearfix" id="product75">[\s\S]*?<\/footer>\s*<\/div>/)[0];
  const updatedCard = firstCard.replaceAll('product75', 'product99')
    .replace('799,000 đ', '899,000 đ')
    .replace('BF26 PLATINUM 1', 'BF26 PLATINUM 7')
    .replace('bf26-platinum-1', 'bf26-platinum-7')
    .replace('200 Mbps', '500 Mbps');
  const { getDeals, warnings } = loadApi(async () => new Response(updatedCard));
  const deals = await getDeals();
  assert.equal(deals.length, 1);
  assert.equal(deals[0].id, 'deal-99');
  assert.equal(deals[0].name, 'BF26 PLATINUM 7');
  assert.equal(deals[0].priceMonthly, 899000);
  assert.equal(deals[0].orderUrl, `${portalUrl}/bf26-platinum-7`);
  assert.ok(deals[0].features.includes('500 Mbps Net Port'));
  assert.equal(deals[0].billingCycles.length, 1);
  assert.equal(deals[0].billingCycles[0].total, 899000);
  assert.equal(warnings.length, 1);
});

test('excludes other product families from Best Plans', async () => {
  const { getDeals } = loadApi(async () => new Response(fixture.replace('BF26 PLATINUM 1', 'BF26 GOLD 1')));
  assert.equal((await getDeals()).length, 5);
});

test('uses the verified Platinum snapshot for network, HTTP and malformed-data failures', async (t) => {
  const scenarios = {
    network: async () => { throw new Error('Network unavailable'); },
    http: async () => new Response('Unavailable', { status: 503 }),
    challenge: async () => new Response('<html>Please wait</html>'),
    'missing cycle': async () => new Response(fixture.replaceAll('1 năm', '')),
    'missing CPU': async () => new Response(fixture.replaceAll('CPU Intel Xeon Platinum', 'Processor')),
    'invalid price': async () => new Response(fixture.replace('799,000 đ', '0 đ')),
    'external order link': async () => new Response(fixture.replace('href="/store/promo-blackfriday26/bf26-platinum-1"', 'href="https://example.com/checkout"')),
  };
  for (const [name, fetchImplementation] of Object.entries(scenarios)) {
    await t.test(name, async () => {
      const { getDeals, warnings } = loadApi(fetchImplementation);
      const deals = await getDeals();
      assert.equal(deals.length, 6);
      assert.equal(deals[0].name, 'BF26 PLATINUM 1');
      assert.equal(deals[0].priceMonthly, 799000);
      assert.equal(deals[5].priceMonthly, 8699000);
      assert.equal(deals[0].billingCycle, '1 năm');
      assert.equal(deals[0].orderUrl, `${portalUrl}/bf26-platinum-1`);
      assert.equal(warnings.length, 1);
      assert.ok(deals.every((deal) => deal.features.includes('Anti DDoS 50Gbps')));
      assert.equal(deals[0].billingCycles[1].total, 1438200);
      assert.equal(deals[5].billingCycles[2].total, 22182450);
    });
  }
});

test('follows a product redirect with its own cookie to retrieve cycle prices', async () => {
  const { getDeals } = loadApi(async () => new Response(fixture), async (url, options) => {
    if (options.redirect === 'manual') {
      const number = Number(String(url).match(/platinum-(\d+)/)[1]);
      return new Response(null, {
        status: 302,
        headers: { Location: `/cart.php?a=confproduct&i=${number}`, 'Set-Cookie': `WHMCS=test-${number}; path=/; HttpOnly` },
      });
    }
    const number = Number(new URL(url).searchParams.get('i'));
    assert.equal(options.headers.Cookie, `WHMCS=test-${number}`);
    return new Response(cycleFixtures[74 + number]);
  });
  assert.equal((await getDeals())[0].billingCycles[2].total, 2037450);
});

test('uses current multi-year prices and respects a cycle removed from the portal', async () => {
  const changed = cycleFixtures[75].replace('1,438,200', '1,500,000')
    .replace(/<option value="triennially">[\s\S]*?<\/option>/, '');
  const { getDeals, warnings } = loadApi(async () => new Response(fixture), async () => new Response(changed));
  const deal = (await getDeals())[0];
  assert.deepEqual(Array.from(deal.billingCycles, (cycle) => cycle.total), [799000, 1500000]);
  assert.equal(deal.billingCycles.some((cycle) => cycle.cycle === 'triennially'), false);
  assert.equal(warnings.length, 0);
});

test('does not reuse stale multi-year snapshot prices if the annual price changes', async () => {
  const { getDeals } = loadApi(
    async () => new Response(fixture.replace('799,000 đ', '899,000 đ')),
    async () => new Response('Unavailable', { status: 503 }),
  );
  const deals = await getDeals();
  assert.equal(deals[0].billingCycles.length, 1);
  assert.equal(deals[0].billingCycles[0].total, 899000);
  assert.equal(deals[1].billingCycles[2].total, 3057450);
});

const vpsLiteFeatures = '<ul><li>1 CPU</li><li>1GB RAM</li><li>20GB SSD NVMe U.2</li><li>1 IPv4 Public</li></ul>';

function liteStoreCard(id, slug, name, monthly) {
  return `<div class="product clearfix" id="product${id}">
    <span id="product${id}-name">${name}</span>
    ${vpsLiteFeatures}
    <footer>
      <div id="product${id}-price"><span class="price">${monthly} đ</span><br>1 tháng</div>
      <a href="/store/vps-gia-re/${slug}" id="product${id}-order-button">Đăng ký</a>
    </footer>
  </div>`;
}

const whmcsEnv = {
  WHMCS_API_IDENTIFIER: 'test-identifier',
  WHMCS_API_SECRET: 'test-secret',
  WHMCS_VPS_LITE_GROUP_ID: '23',
};

test('reads VPS Lite plans and their enabled VND cycles from the WHMCS API', async () => {
  const orderUrl = `${vpsLiteUrl}/vps-lite-1`;
  const { getVpsLite, warnings } = loadApi(async (url, options) => {
    assert.equal(url, whmcsApiUrl);
    assert.equal(options.method, 'POST');
    assert.equal(options.cache, 'no-store');
    assert.deepEqual(Object.fromEntries(options.body), {
      action: 'GetProducts',
      responsetype: 'json',
      identifier: whmcsEnv.WHMCS_API_IDENTIFIER,
      secret: whmcsEnv.WHMCS_API_SECRET,
      gid: whmcsEnv.WHMCS_VPS_LITE_GROUP_ID,
    });
    return Response.json({
      result: 'success',
      products: { product: [{
        pid: 81,
        gid: 23,
        name: 'VPS Lite 1',
        'product-url': orderUrl,
        description: vpsLiteFeatures,
        pricing: {
          VND: { monthly: '89000.00', quarterly: '229000.00', annually: '-1.00' },
          USD: { monthly: '4.00', annually: '40.00' },
        },
      }] },
    });
  }, undefined, whmcsEnv);
  const [plan] = await getVpsLite();
  assert.equal(plan.id, 'vps-81');
  assert.equal(plan.name, 'VPS Lite 1');
  assert.equal(plan.orderUrl, orderUrl);
  assert.equal(plan.priceMonthly, 89000);
  assert.ok(plan.features.includes('20GB SSD NVMe U.2'));
  assert.deepEqual(Array.from(plan.billingCycles, ({ cycle, total }) => [cycle, total]), [
    ['monthly', 89000],
    ['quarterly', 229000],
  ]);
  assert.equal(warnings.length, 0);
});

test('falls back to the live VPS Lite catalog when WHMCS rejects the credentials', async () => {
  const calls = [];
  const { getVpsLite, warnings } = loadApi(async (url) => {
    calls.push(url);
    if (url === whmcsApiUrl) return Response.json({ result: 'error' });
    return new Response(liteStoreCard('99', 'vps-lite-99', 'VPS Lite 99', '90,000'));
  }, async () => new Response(`
    <select id="inputBillingcycle">
      <option value="monthly">90,000 đ 1 tháng</option>
      <option value="quarterly">250,000 đ 3 tháng</option>
    </select>
  `), whmcsEnv);
  const [plan] = await getVpsLite();
  assert.deepEqual(calls, [whmcsApiUrl, vpsLiteUrl]);
  assert.equal(plan.orderUrl, `${vpsLiteUrl}/vps-lite-99`);
  assert.deepEqual(Array.from(plan.billingCycles, (cycle) => cycle.total), [90000, 250000]);
  assert.equal(warnings.length, 1);
});

test('matches VPS Lite cycle snapshots by product and monthly price', async () => {
  const { getVpsLite } = loadApi(async () => new Response(
    liteStoreCard('82', 'vps-lite-2', 'VPS Lite 2', '130,000')
    + liteStoreCard('81', 'vps-lite-1', 'VPS Lite 1', '90,000'),
  ), async () => new Response('Unavailable', { status: 503 }));
  const [secondPlan, firstPlan] = await getVpsLite();
  assert.deepEqual(Array.from(secondPlan.billingCycles, (cycle) => cycle.total), [130000, 330000, 549000, 959000, 1629000]);
  assert.deepEqual(Array.from(firstPlan.billingCycles, (cycle) => cycle.total), [90000]);
});

test('uses the verified VPS Lite snapshot when the storefront is offline', async () => {
  const { getVpsLite } = loadApi(async () => { throw new Error('Offline'); });
  const plans = await getVpsLite();
  assert.equal(plans.length, 12);
  assert.equal(plans[0].priceMonthly, 89000);
  assert.equal(plans[11].priceMonthly, 3059000);
  assert.ok(plans.every((plan) => plan.name.startsWith('VPS Lite ') && plan.orderUrl.startsWith(`${vpsLiteUrl}/`)));
  assert.ok(plans.every((plan) => plan.billingCycles.length === 5 && plan.billingCycles.every((cycle) => Number.isFinite(cycle.total))));
});

const pricingExports = {};
const pricingSource = await readFile(new URL('../lib/platinum-pricing.ts', import.meta.url), 'utf8');
vm.runInNewContext(ts.transpileModule(pricingSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText, { exports: pricingExports, URL });

test('order URLs preserve query parameters and select the requested portal cycle', () => {
  const url = new URL(pricingExports.getPlatinumOrderUrl(`${portalUrl}/bf26-platinum-1?currency=1&billingcycle=annually`, 'triennially'));
  assert.equal(url.searchParams.get('currency'), '1');
  assert.equal(url.searchParams.get('billingcycle'), 'triennially');
  assert.equal(url.searchParams.getAll('billingcycle').length, 1);
});

// Exercise the actual tab handlers and resulting React tree without browser APIs.
const componentSource = await readFile(new URL('../components/sections/HotDeals.tsx', import.meta.url), 'utf8');
const componentCode = ts.transpileModule(componentSource, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
}).outputText;

function setupTabs(deals) {
  let selected = 'annually';
  const exports = {};
  vm.runInNewContext(componentCode, {
    exports,
    Intl,
    require(name) {
      if (name === 'react') return { ...React, useState: () => [selected, (value) => { selected = value; }], useRef: () => ({ current: [] }) };
      if (name === 'react/jsx-runtime') return jsxRuntime;
      if (name === '@/lib/platinum-pricing') return pricingExports;
      return new Proxy({}, { get: (_, key) => String(key) });
    },
  });
  function render() {
    const nodes = [];
    function visit(node) {
      if (Array.isArray(node)) { node.forEach(visit); return; }
      if (!node || typeof node !== 'object' || !node.props) return;
      nodes.push(node);
      visit(node.props.children);
    }
    visit(exports.HotDeals({ deals }));
    return nodes;
  }
  return { render };
}

test('clicking each tab changes all six prices, cycle labels and registration links', async () => {
  const { getDeals } = loadApi(async () => new Response(fixture));
  const deals = await getDeals();
  const { render } = setupTabs(deals);
  for (const [index, key] of ['annually', 'biennially', 'triennially'].entries()) {
    render().find((node) => node.props.id === `platinum-tab-${key}`).props.onClick();
    const nodes = render();
    const tabs = nodes.filter((node) => node.props.role === 'tab');
    assert.equal(tabs.filter((tab) => tab.props['aria-selected']).length, 1);
    assert.equal(tabs[index].props.tabIndex, 0);
    assert.equal(nodes.find((node) => node.props.role === 'tabpanel').props['aria-labelledby'], `platinum-tab-${key}`);
    const links = nodes.filter((node) => node.props.href);
    assert.equal(links.length, 6);
    for (const [dealIndex, link] of links.entries()) {
      assert.equal(new URL(link.props.href).searchParams.get('billingcycle'), key);
      const total = new Intl.NumberFormat('vi-VN').format(deals[dealIndex].billingCycles[index].total) + 'đ';
      assert.ok(nodes.some((node) => node.props.children === total));
    }
  }
});

test('tabs support arrow keys, Home and End with one active tab', () => {
  const { render } = setupTabs([]);
  for (const [key, selected] of [['ArrowLeft', 'triennially'], ['ArrowRight', 'annually'], ['End', 'triennially'], ['Home', 'annually']]) {
    const tab = render().find((node) => node.props.role === 'tab' && node.props['aria-selected']);
    let prevented = false;
    tab.props.onKeyDown({ key, preventDefault() { prevented = true; } });
    assert.equal(prevented, true);
    assert.equal(render().find((node) => node.props.role === 'tab' && node.props['aria-selected']).props.id, `platinum-tab-${selected}`);
  }
});

test('an unavailable cycle shows no annual price or registration link', async () => {
  const { getDeals } = loadApi(async () => new Response(fixture));
  const deals = await getDeals();
  deals[0].billingCycles = deals[0].billingCycles.slice(0, 1);
  const { render } = setupTabs(deals);
  render().find((node) => node.props.id === 'platinum-tab-triennially').props.onClick();
  const nodes = render();
  assert.equal(nodes.filter((node) => node.props.href).length, 5);
  assert.ok(nodes.some((node) => node.props.disabled === true && !node.props.href));
  assert.ok(!nodes.some((node) => node.props.children === '799.000đ'));
});
