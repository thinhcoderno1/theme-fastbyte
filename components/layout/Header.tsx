'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Home, ChevronDown } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileServicesOpen, setIsMobileServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog/' },
    { name: 'Giới thiệu', href: '/gioi-thieu/' },
    { name: 'Liên hệ', href: '/lien-he/' },
  ];

  const serviceLinks = [
    { name: 'Thuê VPS giá rẻ', href: '/', external: false },
    {
      name: 'Ưu Đãi Tiết Kiệm',
      href: 'https://id.thuevpsgiare.vn/store/special-deal-2025',
      external: true,
    },
  ];

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    setIsMobileServicesOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-30 transition-all duration-200 ${
        isScrolled
          ? 'border-b-[3px] border-brand-500 bg-white/95 shadow-[0_8px_24px_rgba(7,16,143,0.12)] backdrop-blur-xl'
          : 'border-b-[3px] border-brand-500 bg-white shadow-[0_3px_12px_rgba(7,16,143,0.08)]'
      }`}
    >
      <Container className="flex h-[56px] max-w-[1240px] items-center justify-between lg:h-[61px]">
        <div className="flex h-full min-w-0 items-center">
          {/* Home shortcut */}
        <Link
          href="/"
            aria-label="Trang chủ"
            aria-current={pathname === '/' ? 'page' : undefined}
            className={`relative flex h-full shrink-0 items-center gap-2 px-1 pr-5 text-[14px] font-semibold transition-colors lg:px-4 ${
              pathname === '/' ? 'text-brand-700' : 'text-ink-600 hover:text-brand-700'
            }`}
        >
            <Home strokeWidth={1.9} size={17} />
            <span className="lg:hidden">Trang chủ</span>
            {pathname === '/' && <span className="absolute -bottom-[3px] inset-x-0 h-[3px] bg-brand-700" />}
        </Link>

          <span className="mr-4 hidden h-8 w-px bg-line-strong lg:block" aria-hidden="true" />

        {/* Desktop Navigation (Dark Theme) */}
        <nav
            className="hidden h-full items-center gap-8 lg:flex"
          aria-label="Điều hướng chính"
        >
          <div className="group relative flex h-full items-center">
            <button
              type="button"
              className="flex h-full items-center gap-1.5 whitespace-nowrap text-[14px] font-semibold text-ink-700 transition-colors hover:text-brand-700 focus:outline-none focus-visible:text-brand-700"
              aria-haspopup="menu"
              aria-controls="desktop-services-menu"
            >
              <span>Dịch vụ</span>
              <ChevronDown
                strokeWidth={2}
                size={15}
                className="transition-transform duration-200 group-hover:rotate-180 group-focus-within:rotate-180"
              />
            </button>

            <div
              id="desktop-services-menu"
              className="invisible absolute left-0 top-full z-50 w-[238px] translate-y-1 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
            >
              <div className="rounded-lg border border-line bg-white p-2 shadow-[0_14px_35px_rgba(7,16,143,0.14)]" role="menu">
                {serviceLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    target={link.external ? '_blank' : undefined}
                    rel={link.external ? 'noopener noreferrer' : undefined}
                    role="menuitem"
                    className="block rounded-md px-3.5 py-2.5 text-[14px] font-medium text-ink-700 transition-colors hover:bg-brand-50 hover:text-brand-700 focus:bg-brand-50 focus:text-brand-700 focus:outline-none"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>

            {navLinks.filter((link) => link.href !== '/').map((link) => {
            const normalizedHref = link.href.replace(/\/$/, '');
            const isActive = pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);

            return (
              <Link
                key={link.name}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                  className={`relative flex h-full items-center whitespace-nowrap text-[14px] font-semibold transition-colors ${
                  isActive
                      ? 'text-brand-700'
                      : 'text-ink-700 hover:text-brand-700'
                }`}
              >
                {link.name}
                  {isActive && <span className="absolute -bottom-[3px] inset-x-0 h-[3px] bg-brand-700" />}
              </Link>
            );
          })}
        </nav>
        </div>

        {/* Right CTA: Nút nhỏ "Xem bảng giá" */}
        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href="/#bang-gia"
            variant="primary"
            size="sm"
            className="h-[38px] rounded-md px-4 text-[13px] font-bold shadow-sm lg:px-5"
            icon={<ArrowRight strokeWidth={2} size={14} />}
          >
            Xem bảng giá
          </Button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => {
            setIsMobileMenuOpen(!isMobileMenuOpen);
            if (isMobileMenuOpen) setIsMobileServicesOpen(false);
          }}
          className="relative z-50 cursor-pointer rounded-md border border-brand-100 bg-brand-50 p-2 text-brand-700 transition-colors hover:bg-brand-100 focus:outline-none focus:ring-2 focus:ring-brand-400 lg:hidden"
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Đóng menu' : 'Mở menu'}
        >
          {isMobileMenuOpen ? (
            <X strokeWidth={2.2} size={23} />
          ) : (
            <Menu strokeWidth={2.2} size={23} />
          )}
        </button>
      </Container>

      {/* Mobile Navigation Drawer (Dark Theme) */}
      {isMobileMenuOpen && (
        <div
          className="absolute inset-x-0 top-full z-40 min-h-[calc(100vh-56px)] bg-black/45 backdrop-blur-xs lg:hidden"
          onClick={closeMobileMenu}
        >
          <div
            className="max-h-[calc(100vh-108px)] overflow-y-auto border-b border-brand-100 bg-white px-5 py-5 text-ink-700 shadow-2xl transition-all duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <nav className="mb-6 flex flex-col space-y-1">
              <Link
                href="/"
                onClick={closeMobileMenu}
                className={`rounded-md px-3.5 py-2.5 text-[16px] font-medium transition-colors ${
                  pathname === '/'
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-700 hover:bg-surface-blue hover:text-brand-700'
                }`}
              >
                Home
              </Link>

              <div>
                <button
                  type="button"
                  onClick={() => setIsMobileServicesOpen(!isMobileServicesOpen)}
                  className="flex w-full items-center justify-between rounded-md px-3.5 py-2.5 text-left text-[16px] font-medium text-ink-700 transition-colors hover:bg-surface-blue hover:text-brand-700"
                  aria-expanded={isMobileServicesOpen}
                  aria-controls="mobile-services-menu"
                >
                  <span>Dịch vụ</span>
                  <ChevronDown
                    strokeWidth={2}
                    size={17}
                    className={`transition-transform ${isMobileServicesOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isMobileServicesOpen && (
                  <div id="mobile-services-menu" className="ml-3 border-l border-brand-100 py-1 pl-3">
                    {serviceLinks.map((link) => (
                      <Link
                        key={link.name}
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        onClick={closeMobileMenu}
                        className="block rounded-md px-3 py-2.5 text-[14px] font-medium text-ink-600 transition-colors hover:bg-brand-50 hover:text-brand-700"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {navLinks.filter((link) => link.href !== '/').map((link) => {
                const normalizedHref = link.href.replace(/\/$/, '');
                const isActive = pathname === normalizedHref || pathname.startsWith(`${normalizedHref}/`);

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={closeMobileMenu}
                    aria-current={isActive ? 'page' : undefined}
                    className={`rounded-md px-3.5 py-2.5 text-[16px] font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-50 text-brand-700'
                        : 'text-ink-700 hover:bg-surface-blue hover:text-brand-700'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="flex flex-col gap-3 border-t border-line pt-5">
              <Button
                href="/#bang-gia"
                variant="primary"
                size="lg"
                className="w-full justify-center shadow-sm font-bold"
                onClick={() => setIsMobileMenuOpen(false)}
                icon={<ArrowRight strokeWidth={2} size={16} />}
              >
                Xem Bảng Giá
              </Button>
              <Button
                href="https://id.thuevpsgiare.vn/login"
                target="_blank"
                variant="outline"
                size="md"
                className="w-full justify-center"
              >
                Đăng nhập Portal
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
