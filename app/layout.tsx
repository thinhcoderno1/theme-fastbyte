import type { Metadata } from 'next';
import { Inter, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { TopBar } from '@/components/layout/TopBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { FloatingContact } from '@/components/layout/FloatingContact';
import { getAssetBaseUrl, getSiteUrl, isIndexingAllowed } from '@/lib/env';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ['latin', 'vietnamese'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-be-vietnam-pro',
  display: 'swap',
});

const siteUrl = getSiteUrl();
const allowIndexing = isIndexingAllowed();
const logoUrl = new URL('/wp-content/uploads/2023/11/logo-thuevpsgiare-1.png', `${getAssetBaseUrl()}/`).toString();
const faviconUrl = new URL('/icon.png', `${siteUrl}/`).toString();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Thuê VPS Giá Rẻ Chỉ Từ 59.000đ/Tháng | VPS Gold NVMe – Fast Byte',
  description: 'Dịch vụ thuê VPS giá rẻ chỉ từ 59k/tháng tại Việt Nam. Trang bị CPU Intel® Xeon® Gold, ổ cứng Enterprise SSD NVMe U.2 siêu tốc, ảo hóa KVM độc lập tài nguyên, Uptime 99.9%, hỗ trợ 24/7.',
  keywords: [
    'thuê vps giá rẻ',
    'vps nvme',
    'vps việt nam',
    'vps gold',
    'vps giá rẻ',
    'thuê cloud vps',
    'fast byte',
    'thuevpsgiare.vn',
  ],
  authors: [{ name: 'Công ty TNHH Dữ liệu Nhanh Fast Byte' }],
  creator: 'Fast Byte',
  publisher: 'Fast Byte',
  robots: {
    index: allowIndexing,
    follow: allowIndexing,
    googleBot: {
      index: allowIndexing,
      follow: allowIndexing,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: siteUrl,
    siteName: 'Fast Byte – Thuê VPS Giá Rẻ',
    title: 'Thuê VPS Giá Rẻ Chỉ Từ 59.000đ/Tháng | VPS Gold NVMe – Fast Byte',
    description: 'Hạ tầng CPU Intel Gold & Ổ cứng NVMe U.2 Enterprise tốc độ vượt trội. Đặt tại Datacenter Tier 3 Việt Nam, cam kết Uptime 99.9%, hỗ trợ kỹ thuật 24/7.',
    images: [
      {
        url: faviconUrl,
        width: 500,
        height: 500,
        alt: 'Thuê VPS Giá Rẻ Fast Byte',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thuê VPS Giá Rẻ Chỉ Từ 59.000đ/Tháng | VPS Gold NVMe – Fast Byte',
    description: 'Hạ tầng CPU Intel Gold & Ổ cứng NVMe U.2 Enterprise tốc độ vượt trội. Đặt tại Datacenter Tier 3 Việt Nam.',
    images: [faviconUrl],
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Công ty TNHH Dữ liệu Nhanh Fast Byte',
    alternateName: 'Fast Byte',
    url: siteUrl,
    logo: logoUrl,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+84-28-7300-6198',
      contactType: 'customer service',
      areaServed: 'VN',
      availableLanguage: ['Vietnamese', 'English'],
    },
    address: {
      '@type': 'PostalAddress',
      streetAddress: '200 Song Hành',
      addressLocality: 'Phường An Phú, TP. Thủ Đức',
      addressRegion: 'TP. Hồ Chí Minh',
      postalCode: '700000',
      addressCountry: 'VN',
    },
    taxID: '0316985515',
  };

  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`}>
      <body className="min-h-screen flex flex-col bg-surface text-ink-500 font-body selection:bg-brand-100 selection:text-brand-900">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <TopBar />
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <FloatingContact />
        <Footer />
      </body>
    </html>
  );
}
