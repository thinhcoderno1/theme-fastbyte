'use client';

import React, { useState } from 'react';
import { ChevronDown, BookOpen, Check, Server, Shield, Zap } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { Button } from '@/components/ui/Button';
import { FadeIn } from '@/components/ui/FadeIn';

export function InfoSection() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section id="tim-hieu" className="py-20 md:py-24 bg-surface-subtle border-t border-line relative">
      <Container>
        <FadeIn>
          <SectionHeader
            overline="Cẩm Nang Toàn Diện"
            title="Tìm Hiểu Về Dịch Vụ VPS Giá Rẻ"
            subtitle="Tất cả kiến thức cần biết về máy chủ ảo VPS: từ khái niệm, tiêu chí chọn mua đến so sánh công nghệ phần cứng."
            align="left"
          />
        </FadeIn>

        {/* Content Wrapper with CSS Collapsible Height for SEO preservation */}
        <FadeIn delay={0.1} className="relative">
          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden text-ink-600 ${
              isExpanded ? 'max-h-[6000px]' : 'max-h-[260px]'
            }`}
          >
            <div className="space-y-8 text-[15px] md:text-[16px] leading-[1.75] text-left">
              {/* Part 1 */}
              <div>
                <h3 className="text-[20px] font-heading font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <Server strokeWidth={2} size={20} className="text-brand-700" />
                  1. VPS là gì và nguyên lý hoạt động của máy chủ ảo
                </h3>
                <p className="mb-3">
                  <strong>VPS (Virtual Private Server - Máy chủ riêng ảo)</strong> là giải pháp lưu trữ và tính toán đám mây được tạo ra bằng cách phân chia một máy chủ vật lý (Physical Dedicated Server) thành nhiều máy chủ ảo độc lập thông qua công nghệ ảo hóa (Hypervisor) như <strong>KVM (Kernel-based Virtual Machine)</strong> hoặc <strong>Proxmox VE</strong>.
                </p>
                <p>
                  Mỗi máy chủ VPS được cấp phát hệ thống tài nguyên chuyên biệt bao gồm số nhân <strong>CPU Intel Xeon Gold</strong>, dung lượng bộ nhớ <strong>RAM DDR4 ECC</strong>, không gian lưu trữ trên ổ cứng <strong>SSD NVMe U.2</strong> và một địa chỉ <strong>IPv4 tĩnh riêng</strong>. Người dùng sở hữu toàn quyền quản trị cao nhất (Full Root Access) để cài đặt bất kỳ hệ điều hành Linux nào (Ubuntu, Debian, AlmaLinux, CentOS) và toàn quyền tùy biến cấu hình hệ thống máy chủ theo mục đích sử dụng.
                </p>
              </div>

              {/* Part 2: Table Comparison */}
              <div>
                <h3 className="text-[20px] font-heading font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <Zap strokeWidth={2} size={20} className="text-brand-700" />
                  2. So sánh chi tiết: Thuê VPS vs Shared Hosting vs Máy chủ vật lý riêng
                </h3>
                <p className="mb-4">
                  Để đưa ra quyết định đúng đắn cho website hoặc dự án công nghệ của bạn, bảng so sánh dưới đây phân tích các yếu tố then chốt giữa các hình thức lưu trữ phổ biến hiện nay:
                </p>

                <div className="overflow-x-auto border border-line rounded-lg bg-white shadow-xs mb-6">
                  <table className="w-full text-[14px] text-left border-collapse">
                    <thead>
                      <tr className="bg-brand-900 text-white font-heading">
                        <th className="p-3.5 border-r border-brand-800">Tiêu chí đánh giá</th>
                        <th className="p-3.5 border-r border-brand-800">Shared Web Hosting</th>
                        <th className="p-3.5 border-r border-brand-800 bg-brand-700">Thuê VPS Giá Rẻ (Fast Byte)</th>
                        <th className="p-3.5">Dedicated Server (Vật lý)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Tài nguyên phần cứng</td>
                        <td className="p-3.5 text-ink-500">Dùng chung hàng trăm website</td>
                        <td className="p-3.5 font-semibold text-brand-700 bg-brand-50/50">Độc lập 100% qua ảo hóa KVM</td>
                        <td className="p-3.5 text-ink-500">Sở hữu toàn bộ phần cứng</td>
                      </tr>
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Quyền quản trị</td>
                        <td className="p-3.5 text-ink-500">Bị giới hạn qua cPanel</td>
                        <td className="p-3.5 font-semibold text-brand-700 bg-brand-50/50">Full Root SSH quyền cao nhất</td>
                        <td className="p-3.5 text-ink-500">Full Root quyền cao nhất</td>
                      </tr>
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Ổ cứng lưu trữ</td>
                        <td className="p-3.5 text-ink-500">SSD SATA thông thường</td>
                        <td className="p-3.5 font-semibold text-brand-700 bg-brand-50/50">Enterprise SSD NVMe U.2</td>
                        <td className="p-3.5 text-ink-500">Tùy chọn cấu hình theo máy</td>
                      </tr>
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Địa chỉ IP</td>
                        <td className="p-3.5 text-ink-500">Dùng chung (Shared IP)</td>
                        <td className="p-3.5 font-semibold text-brand-700 bg-brand-50/50">01 Dedicated IPv4 riêng biệt</td>
                        <td className="p-3.5 text-ink-500">IPv4 riêng biệt</td>
                      </tr>
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Khả năng nâng cấp</td>
                        <td className="p-3.5 text-ink-500">Giới hạn theo gói</td>
                        <td className="p-3.5 font-semibold text-brand-700 bg-brand-50/50">Tức thì trong 1 phút, giữ nguyên IP/Data</td>
                        <td className="p-3.5 text-ink-500">Phải tháo lắp phần cứng</td>
                      </tr>
                      <tr className="hover:bg-surface-subtle">
                        <td className="p-3.5 font-semibold text-ink-900">Chi phí đầu tư</td>
                        <td className="p-3.5 text-ink-500">30.000đ – 100.000đ/tháng</td>
                        <td className="p-3.5 font-bold text-emerald-600 bg-brand-50/50">Chỉ từ 59.000đ/tháng</td>
                        <td className="p-3.5 text-ink-500">1.800.000đ – 5.000.000đ+/tháng</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Part 3: When to rent VPS */}
              <div>
                <h3 className="text-[20px] font-heading font-bold text-ink-900 mb-3 flex items-center gap-2">
                  <Shield strokeWidth={2} size={20} className="text-brand-700" />
                  3. Khi nào doanh nghiệp và cá nhân nên thuê VPS giá rẻ?
                </h3>
                <p className="mb-3">
                  Việc chuyển đổi từ shared hosting lên <strong>thuê VPS giá rẻ</strong> là bước đi chiến lược khi hệ thống của bạn gặp các trường hợp sau:
                </p>
                <ul className="space-y-2.5 pl-2 mb-4">
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[12px] mt-0.5">✓</span>
                    <span><strong>Website bán hàng, thương mại điện tử:</strong> Các trang web WordPress, WooCommerce, Magento hoặc Laravel có lượng truy cập tăng trưởng cần tốc độ load trang dưới 1.5 giây để tối ưu chuyển đổi đơn hàng và chuẩn SEO Google Core Web Vitals.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[12px] mt-0.5">✓</span>
                    <span><strong>Phát triển phần mềm và API Server:</strong> Triển khai các ứng dụng backend hiện đại viết bằng Node.js, Python FastAPI, Golang, Ruby on Rails, Java Spring Boot hoặc Docker containers.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[12px] mt-0.5">✓</span>
                    <span><strong>Quản lý cơ sở dữ liệu độc lập:</strong> Cần máy chủ chuyên dụng lưu trữ MySQL, PostgreSQL, MongoDB, Redis Cache mà không bị giới hạn bộ nhớ hay timeout kết nối.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-[12px] mt-0.5">✓</span>
                    <span><strong>Chạy các ứng dụng tự động hóa & bot:</strong> Chạy các script tự động thu thập dữ liệu (crawling), bot Telegram/Discord, hệ thống VPN riêng tư WireGuard/OpenVPN an toàn.</span>
                  </li>
                </ul>
              </div>

              {/* Part 4: Key criteria for choosing cheap VPS */}
              <div>
                <h3 className="text-[20px] font-heading font-bold text-ink-900 mb-3">
                  4. Tiêu chí quan trọng khi chọn thuê VPS giá rẻ tại Việt Nam
                </h3>
                <p className="mb-3">
                  Trên thị trường có rất nhiều đơn vị cung cấp dịch vụ VPS, tuy nhiên để tránh gặp phải tình trạng máy chủ chậm chạp, hay bị treo hoặc bóp cấu hình, bạn cần đặc biệt chú ý 5 tiêu chí cốt lõi:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
                  <div className="bg-white p-4.5 rounded-lg border border-line">
                    <h4 className="font-bold text-ink-900 mb-1">Dòng CPU máy chủ</h4>
                    <p className="text-[14px] text-ink-500">Ưu tiên vi xử lý <strong>Intel Xeon Gold</strong> hoặc AMD EPYC để đảm bảo xung nhịp đơn nhân cao và khả năng xử lý song song vượt trội so với các dòng CPU đời cũ.</p>
                  </div>
                  <div className="bg-white p-4.5 rounded-lg border border-line">
                    <h4 className="font-bold text-ink-900 mb-1">Công nghệ ổ cứng NVMe U.2</h4>
                    <p className="text-[14px] text-ink-500">Ổ cứng <strong>NVMe U.2 Enterprise</strong> mang lại IOPS hàng trăm nghìn và băng thông đọc ghi từ 1.5 - 2.5 GB/s, giải quyết triệt để nút thắt cổ chai I/O đĩa.</p>
                  </div>
                  <div className="bg-white p-4.5 rounded-lg border border-line">
                    <h4 className="font-bold text-ink-900 mb-1">Ảo hóa KVM độc lập</h4>
                    <p className="text-[14px] text-ink-500">Ảo hóa phần cứng KVM đảm bảo 100% RAM và CPU được gán cứng, ngăn chặn nhà cung cấp oversell tài nguyên gây ảnh hưởng hiệu năng.</p>
                  </div>
                  <div className="bg-white p-4.5 rounded-lg border border-line">
                    <h4 className="font-bold text-ink-900 mb-1">Datacenter đặt tại Việt Nam</h4>
                    <p className="text-[14px] text-ink-500">Trung tâm dữ liệu trong nước (Viettel, VNPT) cho ping chỉ 1-5ms, đường truyền nội địa ổn định không lo đứt cáp quang biển AAG/APG.</p>
                  </div>
                </div>
              </div>

              {/* Part 5: Why choose Fast Byte */}
              <div>
                <h3 className="text-[20px] font-heading font-bold text-ink-900 mb-3">
                  5. Vì sao nên thuê VPS giá rẻ tại Fast Byte (ThueVPSGiaRe.vn)?
                </h3>
                <p className="mb-3">
                  <strong>Công ty TNHH Dữ liệu Nhanh Fast Byte</strong> là đơn vị tiên phong tại Việt Nam cung cấp dịch vụ máy chủ ảo cấu hình cao với mức chi phí tối ưu nhất cho cộng đồng lập trình viên và doanh nghiệp:
                </p>
                <ul className="space-y-2 pl-2">
                  <li>• <strong>Giá thuê hợp lý chỉ từ 59.000đ/tháng:</strong> Đem công nghệ điện toán đám mây cao cấp đến gần với mọi khách hàng.</li>
                  <li>• <strong>Hệ thống kích hoạt tức thì 100% tự động:</strong> Nhận bàn giao thông tin đăng nhập và IP sau 1-3 phút kể từ khi thanh toán.</li>
                  <li>• <strong>Hỗ trợ kỹ thuật 24/7/365 chuyên sâu:</strong> Kỹ sư túc trực hỗ trợ qua hệ thống Ticket, Hotline và Email nhanh chóng.</li>
                  <li>• <strong>Minh bạch pháp lý & cam kết SLA 99.9%:</strong> Đăng ký chính thức với Bộ Công Thương, đầy đủ hóa đơn GTGT điện tử.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Bottom Gradient Fade (only visible when collapsed) */}
          {!isExpanded && (
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-surface-subtle via-surface-subtle/80 to-transparent pointer-events-none" />
          )}
        </FadeIn>

        {/* Toggle Expand / Collapse Button */}
        <div className="mt-8 text-center relative z-10">
          <Button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            size="md"
            className="bg-white border-line shadow-xs font-semibold hover:border-brand-300"
            icon={
              <ChevronDown
                strokeWidth={2}
                size={18}
                className={`transition-transform duration-200 ${
                  isExpanded ? 'rotate-180 text-brand-700' : 'text-brand-700'
                }`}
              />
            }
            aria-expanded={isExpanded}
          >
            {isExpanded ? 'Thu gọn' : 'Xem thêm'}
          </Button>
        </div>
      </Container>
    </section>
  );
}
