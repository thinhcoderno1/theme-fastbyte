import React from 'react';
import { getSpecialDeals, getCloudVps } from '@/lib/api';
import { Hero } from '@/components/sections/Hero';
import { HotDeals } from '@/components/sections/HotDeals';
import { Pricing } from '@/components/sections/Pricing';
import { Features } from '@/components/sections/Features';
import { Benefits } from '@/components/sections/Benefits';
import { Benchmark } from '@/components/sections/Benchmark';
import { OsSupport } from '@/components/sections/OsSupport';
import { Process } from '@/components/sections/Process';
import { Feedbacks } from '@/components/sections/Feedbacks';
import { Partners } from '@/components/sections/Partners';
import { Faqs } from '@/components/sections/Faqs';
import { InfoSection } from '@/components/sections/InfoSection';

export const revalidate = 900; // Refresh portal pricing every 15 minutes

export default async function HomePage() {
  // Fetch real data with fallback mock
  const [deals, plans] = await Promise.all([
    getSpecialDeals(),
    getCloudVps(),
  ]);

  // Schema.org Product / Offer Catalog JSON-LD
  const productCatalogSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'Dịch Vụ Thuê VPS Giá Rẻ - Fast Byte',
    image: 'https://thuevpsgiare.vn/wp-content/uploads/2023/11/logo-thuevpsgiare-1.png',
    description: 'Dịch vụ thuê máy chủ ảo VPS giá rẻ tại Việt Nam sử dụng CPU Intel Xeon Gold, ổ cứng SSD NVMe U.2 Enterprise, ảo hóa KVM 100% tài nguyên độc lập.',
    brand: {
      '@type': 'Brand',
      name: 'Fast Byte',
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'VND',
      lowPrice: Math.min(...plans.map((plan) => plan.priceMonthly)).toString(),
      highPrice: Math.max(...plans.map((plan) => plan.priceMonthly)).toString(),
      offerCount: plans.length.toString(),
      offers: plans.map((p) => ({
        '@type': 'Offer',
        name: p.name,
        price: p.priceMonthly.toString(),
        priceCurrency: 'VND',
        availability: 'https://schema.org/InStock',
        url: p.orderUrl,
      })),
    },
  };

  return (
    <>
      {/* Schema.org Product JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productCatalogSchema) }}
      />

      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Hot Deals Section */}
      <HotDeals deals={deals} />

      {/* 3. Pricing Section */}
      <Pricing plans={plans} />

      {/* 4. Features / Infrastructure Section */}
      <Features />

      {/* 5. Benefits & Metrics Section */}
      <Benefits />

      {/* 6. Benchmark Section */}
      <Benchmark />

      {/* 7. Operating System Support Section */}
      <OsSupport />

      {/* 8. Registration Process Section */}
      <Process />

      {/* 9. Customer Feedback Slider Section */}
      <Feedbacks />

      {/* 10. Partners & Technology Section */}
      <Partners />

      {/* 11. FAQ Accordion Section */}
      <Faqs />

      {/* 12. SEO Info & Guide Section */}
      <InfoSection />
    </>
  );
}
