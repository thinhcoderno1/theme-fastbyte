import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, MapPin, Mail, Phone, Building2 } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { getAssetBaseUrl } from '@/lib/env';

export function Footer() {
  const commerceLogoUrl = new URL('/wp-content/uploads/2024/09/logoSaleNoti.png', `${getAssetBaseUrl()}/`).toString();
  return (
    <footer className="bg-brand-900 text-white pt-16 pb-12 border-t border-brand-800">
      <Container>
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 gap-10 border-b border-brand-800/80 pb-12 md:grid-cols-2 xl:grid-cols-4 xl:gap-8">
          {/* Col 1: Dịch vụ & Hướng dẫn */}
          <div>
            <h3 className="text-white text-[17px] font-heading font-semibold mb-4 border-l-2 border-accent-500 pl-3">
              Các dịch vụ VPS
            </h3>
            <ul className="space-y-2.5 text-[14px] text-white/80 mb-6">
              <li>
                <Link href="https://id.thuevpsgiare.vn/store/cloud-vps" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Thuê VPS Giá Rẻ
                </Link>
              </li>
              <li>
                <a
                  href="https://id.thuevpsgiare.vn/store/special-deal-2025"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-accent-400">›</span> Ưu Đãi Tiết Kiệm
                </a>
              </li>
              {/* <li>
                <a
                  href="https://id.thuevpsgiare.vn/store/cloud-vps"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-accent-400">›</span> VPS Gold NVMe Enterprise
                </a>
              </li> */}
            </ul>

            <h3 className="text-white text-[15px] font-heading font-semibold mb-3 border-l-2 border-brand-400 pl-3">
              Câu hỏi thường gặp
            </h3>
            <ul className="space-y-2.5 text-[14px] text-white/80">
              <li>
                <Link
                  href="/huong-dan-gui-yeu-cau-ho-tro-tai-thue-vps-gia-re-fast-byte-ltd/"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span className="text-brand-300">›</span> Hướng dẫn gửi Tickets hỗ trợ
                </Link>
              </li>
              <li>
                <Link
                  href="/thay-doi-thong-tin-quan-tri-thuevpsgiare/"
                  className="hover:text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                >
                  <span className="text-brand-300">›</span> Hướng dẫn thay đổi thông tin quản trị
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Thông tin thêm */}
          <div>
            <h3 className="text-white text-[17px] font-heading font-semibold mb-4 border-l-2 border-accent-500 pl-3">
              Thông tin thêm
            </h3>
            <ul className="space-y-2.5 text-[14px] text-white/80">
              <li>
                <Link href="/gioi-thieu/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Giới Thiệu
                </Link>
              </li>
              <li>
                <Link href="/lien-he/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Liên Hệ
                </Link>
              </li>
              <li>
                <Link href="/blog/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Blog & Tin Tức
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Thông báo
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Tuyển Dụng
                </Link>
              </li>
              <li>
                <Link href="/#" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Cộng Tác Viên
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quy định & Chính sách */}
          <div>
            <h3 className="text-white text-[17px] font-heading font-semibold mb-4 border-l-2 border-accent-500 pl-3">
              Quy định & Chính sách
            </h3>
            <ul className="space-y-2.5 text-[14px] text-white/80">
              <li>
                <Link href="/dieu-khoan-su-dung/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-bao-mat/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="/chinh-sach-xu-ly-khieu-nai/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Chính sách xử lý khiếu nại
                </Link>
              </li>
              <li>
                <Link href="/quy-dinh-doi-tra-va-hoan-tien/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Quy định đổi trả & hoàn tiền
                </Link>
              </li>
              <li>
                <Link href="/huong-dan-thanh-toan-vnpay/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Hướng dẫn thanh toán VNPAY
                </Link>
              </li>
              <li>
                <Link href="/phuong-thuc-thanh-toan/" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <span className="text-accent-400">›</span> Phương thức thanh toán
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Doanh nghiệp & Bộ Công Thương */}
          <div>
            <h3 className="text-white text-[17px] font-heading font-semibold mb-4 border-l-2 border-accent-500 pl-3">
              <span className="block whitespace-nowrap">CÔNG TY TNHH DỮ LIỆU NHANH</span>
              <span className="block">FAST BYTE</span>
            </h3>
            <div className="space-y-3 text-[14px] text-white/80 mb-5">
              <div className="flex items-start gap-2.5">
                <MapPin strokeWidth={1.75} size={18} className="text-accent-400 shrink-0 mt-0.5" />
                <span className="whitespace-nowrap">200 Song Hành, P. Bình Trưng, TP. HCM</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Building2 strokeWidth={1.75} size={18} className="text-accent-400 shrink-0" />
                <span>Mã số thuế: <strong className="text-white">0316985515</strong></span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone strokeWidth={1.75} size={18} className="text-accent-400 shrink-0" />
                <a href="tel:02873006198" className="hover:text-white font-medium">
                  Hotline: 0287 300 6198
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail strokeWidth={1.75} size={18} className="text-accent-400 shrink-0" />
                <a href="mailto:info@thuevpsgiare.vn" className="hover:text-white">
                  info@thuevpsgiare.vn
                </a>
              </div>
            </div>

            {/* Logo Bộ Công Thương */}
            <div className="pt-2">
              <a
                href="http://online.gov.vn/nen-tang/6c1914fe-4504-47f3-aee2-d9f9ff834967"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block relative hover:opacity-90 transition-opacity"
              >
                <div className="relative w-[150px] h-[57px]">
                  <Image
                    src={commerceLogoUrl}
                    alt="Đã đăng ký Bộ Công Thương - Fast Byte"
                    fill
                    sizes="150px"
                    className="object-contain object-left"
                  />
                </div>
              </a>
              {/* <p className="text-[12px] text-white/60 mt-1">
                Website thương mại điện tử đã được chứng nhận bởi Bộ Công Thương.
              </p> */}
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-white/70">
          <div className="flex items-center gap-2">
            <ShieldCheck strokeWidth={1.75} size={16} className="text-accent-400" />
            <span>© 2026 <strong>CÔNG TY TNHH DỮ LIỆU NHANH FAST BYTE</strong>. All rights reserved.</span>
          </div>

          {/* <div className="flex items-center gap-4 text-white/60">
            <span className="flex items-center gap-1">
              <CheckCircle2 strokeWidth={2} size={14} className="text-emerald-400" />
              Cam kết Uptime 99.9%
            </span>
            <span>•</span>
            <span>Hạ tầng Intel® Gold & NVMe U.2 Enterprise</span>
          </div> */}
        </div>
      </Container>
    </footer>
  );
}
