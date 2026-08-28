import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Mail, UserPlus, LogIn, LifeBuoy } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getAssetBaseUrl } from '@/lib/env';

export function TopBar() {
  const logoUrl = new URL('/wp-content/uploads/2023/11/logo-thuevpsgiare-1.png', `${getAssetBaseUrl()}/`).toString();
  return (
    <div className="relative z-40 bg-brand-700 text-[12.5px] text-white shadow-[0_1px_0_rgba(255,255,255,0.12)]">
      <Container className="flex min-h-[50px] max-w-[1240px] items-center justify-between lg:min-h-[52px]">
        <Link
          href="/"
          className="shrink-0 rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-400"
          aria-label="Fast Byte - Trang chủ"
        >
          <span className="relative block h-[38px] w-[134px] sm:w-[145px] lg:h-[40px] lg:w-[154px]">
            <Image
              src={logoUrl}
              alt="Fast Byte - Thuê VPS Giá Rẻ"
              fill
              sizes="(min-width: 1024px) 154px, (min-width: 640px) 145px, 134px"
              priority
              className="object-contain object-left"
            />
          </span>
        </Link>

        {/* Utility links */}
        <div className="flex items-center gap-2.5 sm:gap-4 lg:gap-5">
          <a
            href="tel:02873006198"
            className="hidden items-center gap-1.5 whitespace-nowrap text-white/90 transition-colors hover:text-white sm:flex"
            aria-label="Hotline 0287 300 6198"
          >
            <Phone strokeWidth={1.9} size={15} className="text-accent-400" />
            <span className="font-normal">Hotline: <strong className="font-semibold text-white">0287 300 6198</strong></span>
          </a>
          <a
            href="mailto:info@thuevpsgiare.vn"
            className="hidden items-center gap-1.5 text-white/80 transition-colors hover:text-white xl:flex"
          >
            <Mail strokeWidth={1.8} size={14} />
            <span>info@thuevpsgiare.vn</span>
          </a>
          <span className="hidden h-5 w-px bg-white/20 lg:block" aria-hidden="true" />
          <a
            href="https://id.thuevpsgiare.vn/submitticket.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 text-white/85 transition-colors hover:text-white lg:flex"
          >
            <LifeBuoy strokeWidth={1.8} size={14} />
            <span>Gửi ticket</span>
          </a>
          <a
            href="https://id.thuevpsgiare.vn/login"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 whitespace-nowrap text-white/90 transition-colors hover:text-white"
            aria-label="Đăng nhập tài khoản"
          >
            <LogIn strokeWidth={1.8} size={15} />
            <span>Đăng nhập</span>
          </a>
          <a
            href="https://id.thuevpsgiare.vn/register.php"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-md border border-white/25 px-3 py-1.5 font-semibold text-white transition-colors hover:border-white/45 hover:bg-white/10 md:flex"
          >
            <UserPlus strokeWidth={1.8} size={14} />
            <span>Đăng ký</span>
          </a>
        </div>
      </Container>
    </div>
  );
}
