'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, PhoneCall, CheckCircle2, Shield, Cpu, HardDrive } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export function Hero() {
  const highlights = [
    'Intel® Xeon® Gold',
    'SSD NVMe U.2',
    'Datacenter VN',
    'Uptime 99.9%',
  ];

  return (
    <section
      id="hero"
      className="relative overflow-hidden hero-pattern text-white py-16 md:py-24 lg:py-28"
    >
      {/* Decorative subtle ambient lights */}
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-accent-500/10 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Hero Content */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="mb-5"
            >
              <Badge
                variant="dark"
                size="md"
                icon={<Zap strokeWidth={2} size={14} className="text-accent-400" />}
                className="font-medium"
              >
                VPS Gold NVMe Tốc Độ Cao
              </Badge>
            </motion.div>

            {/* H1 Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.05, ease: 'easeOut' }}
              className="text-white font-extrabold tracking-tight text-balance mb-4 leading-[1.08]"
            >
              Thuê VPS Giá Rẻ
            </motion.h1>

            {/* Subheading with Accent Gold */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.1, ease: 'easeOut' }}
              className="text-[19px] md:text-[22px] font-heading font-semibold text-white/95 mb-4"
            >
              Chỉ Từ{' '}
              <span className="text-accent-400 font-bold underline decoration-accent-400/40 decoration-2 underline-offset-4">
                49.000đ/Tháng
              </span>
            </motion.p>

            {/* Sapo Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.15, ease: 'easeOut' }}
              className="text-[15px] md:text-[17px] text-white/85 leading-relaxed mb-8 max-w-xl text-balance"
            >
              Hạ tầng máy chủ ảo độc lập trang bị vi xử lý <strong>Intel® Xeon® Gold</strong>, ổ cứng Enterprise <strong>NVMe U.2</strong> tốc độ vượt trội, đặt tại Datacenter chuẩn Tier 3 tại Việt Nam với Uptime 99.9% và hỗ trợ kỹ thuật 24/7.
            </motion.p>

            {/* 2 CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: 0.2, ease: 'easeOut' }}
              className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto"
            >
              <Button
                href="#bang-gia"
                variant="dark-primary"
                size="lg"
                className="w-full sm:w-auto"
                icon={<ArrowRight strokeWidth={2} size={18} />}
                iconPosition="right"
              >
                Xem Bảng Giá
              </Button>
              <Button
                href="tel:02873006198"
                variant="dark-outline"
                size="lg"
                className="w-full sm:w-auto"
                icon={<PhoneCall strokeWidth={1.75} size={18} />}
                iconPosition="left"
              >
                Tư Vấn Miễn Phí
              </Button>
            </motion.div>

            {/* 4 Feature Ticks */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.25, ease: 'easeOut' }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/15 w-full"
            >
              {highlights.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[13px] text-white/90">
                  <CheckCircle2 strokeWidth={2.2} size={15} className="text-emerald-400 shrink-0" />
                  <span className="font-medium">{item}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: 3D Server Rack Illustration */}
          <div className="lg:col-span-5 flex items-center justify-center relative">
            {/* Orbital Particle Background */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[340px] h-[340px] rounded-full border border-white/10 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="w-[420px] h-[420px] rounded-full border border-white/5 animate-spin" style={{ animationDuration: '45s', animationDirection: 'reverse' }} />
            </div>

            {/* Floating 3D Isometric Server Rack SVG */}
            <motion.div
              animate={{
                y: [0, -14, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-full max-w-[420px] aspect-square flex items-center justify-center"
            >
              <svg
                viewBox="0 0 460 460"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-full drop-shadow-2xl"
              >
                {/* Outer Glow / Shadow */}
                <ellipse cx="230" cy="400" rx="170" ry="32" fill="#030836" fillOpacity="0.6" />

                {/* Main Server Chassis Isometric Structure */}
                {/* Rack Base */}
                <path d="M120 340 L230 400 L340 340 L230 280 Z" fill="#0A1560" stroke="#25359E" strokeWidth="2" />

                {/* Server Unit 3 (Bottom) */}
                <g>
                  {/* Left Face */}
                  <path d="M120 280 L230 340 L230 380 L120 320 Z" fill="#0D1A73" stroke="#25359E" strokeWidth="1.5" />
                  {/* Right Face */}
                  <path d="M230 340 L340 280 L340 320 L230 380 Z" fill="#132490" stroke="#25359E" strokeWidth="1.5" />
                  {/* Top Face */}
                  <path d="M120 280 L230 220 L340 280 L230 340 Z" fill="#182EA8" stroke="#3A4EC7" strokeWidth="1.5" />
                  
                  {/* Bay Slots & Drive bays */}
                  <line x1="145" y1="305" x2="210" y2="340" stroke="#2A3EB8" strokeWidth="3" strokeLinecap="round" />
                  <line x1="145" y1="315" x2="210" y2="350" stroke="#2A3EB8" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* LED status lights */}
                  <circle cx="218" cy="342" r="3" fill="#10B981" className="animate-pulse" />
                  <circle cx="218" cy="352" r="3" fill="#3B82F6" />
                  <circle cx="250" cy="336" r="3" fill="#10B981" />
                  <circle cx="270" cy="326" r="3" fill="#F59E0B" />
                </g>

                {/* Server Unit 2 (Middle) */}
                <g transform="translate(0, -70)">
                  {/* Left Face */}
                  <path d="M120 280 L230 340 L230 380 L120 320 Z" fill="#101F82" stroke="#2A3EB8" strokeWidth="1.5" />
                  {/* Right Face */}
                  <path d="M230 340 L340 280 L340 320 L230 380 Z" fill="#182AA2" stroke="#2A3EB8" strokeWidth="1.5" />
                  {/* Top Face */}
                  <path d="M120 280 L230 220 L340 280 L230 340 Z" fill="#2037BA" stroke="#465BD9" strokeWidth="1.5" />
                  
                  {/* Drive bays */}
                  <line x1="145" y1="305" x2="210" y2="340" stroke="#3B50CD" strokeWidth="3" strokeLinecap="round" />
                  <line x1="145" y1="315" x2="210" y2="350" stroke="#3B50CD" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Gold accent line */}
                  <line x1="250" y1="328" x2="320" y2="292" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" />

                  {/* LED status lights */}
                  <circle cx="218" cy="342" r="3" fill="#10B981" />
                  <circle cx="218" cy="352" r="3" fill="#10B981" className="animate-pulse" />
                  <circle cx="240" cy="341" r="3.5" fill="#F5A623" />
                </g>

                {/* Server Unit 1 (Top) */}
                <g transform="translate(0, -140)">
                  {/* Left Face */}
                  <path d="M120 280 L230 340 L230 380 L120 320 Z" fill="#14269E" stroke="#374CCF" strokeWidth="1.5" />
                  {/* Right Face */}
                  <path d="M230 340 L340 280 L340 320 L230 380 Z" fill="#1E34BC" stroke="#374CCF" strokeWidth="1.5" />
                  {/* Top Face (Cover) */}
                  <path d="M120 280 L230 220 L340 280 L230 340 Z" fill="#2D45D8" stroke="#5B6FE6" strokeWidth="2" />
                  
                  {/* Top Cover Details & Hex pattern */}
                  <path d="M160 270 L230 232 L300 270 L230 308 Z" fill="#2237B6" stroke="#465CD9" strokeWidth="1" />

                  {/* CPU / NVMe badge on top
                  <circle cx="230" cy="270" r="16" fill="#07108F" stroke="#F5A623" strokeWidth="2" />
                  <text x="230" y="274" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">NVMe</text> */}

                  {/* Drive bays */}
                  <line x1="145" y1="305" x2="210" y2="340" stroke="#465BD9" strokeWidth="3" strokeLinecap="round" />
                  <line x1="145" y1="315" x2="210" y2="350" stroke="#465BD9" strokeWidth="3" strokeLinecap="round" />
                  
                  {/* Blinking activity LEDs */}
                  <circle cx="218" cy="342" r="3" fill="#10B981" className="animate-ping" />
                  <circle cx="218" cy="342" r="3" fill="#10B981" />
                  <circle cx="218" cy="352" r="3" fill="#60A5FA" />
                  <circle cx="250" cy="336" r="3" fill="#10B981" />
                  <circle cx="270" cy="326" r="3" fill="#3B82F6" />
                </g>

                {/* Floating Metric Badges around Server */}
                {/* <g transform="translate(45, 120)">
                  <rect x="0" y="0" width="105" height="34" rx="8" fill="#07108F" fillOpacity="0.9" stroke="#3A4EC7" strokeWidth="1.5" />
                  <text x="12" y="21" fill="#FBBF5C" fontSize="11" fontWeight="bold" fontFamily="sans-serif">⚡ 1.5 GB/s</text>
                </g>

                <g transform="translate(315, 230)">
                  <rect x="0" y="0" width="105" height="34" rx="8" fill="#07108F" fillOpacity="0.9" stroke="#3A4EC7" strokeWidth="1.5" />
                  <text x="12" y="21" fill="#34D399" fontSize="11" fontWeight="bold" fontFamily="sans-serif">● 99.9% SLA</text>
                </g>

                <g transform="translate(300, 95)">
                  <rect x="0" y="0" width="115" height="34" rx="8" fill="#07108F" fillOpacity="0.9" stroke="#3A4EC7" strokeWidth="1.5" />
                  <text x="12" y="21" fill="#93C5FD" fontSize="11" fontWeight="bold" fontFamily="sans-serif">Intel® Gold</text>
                </g> */}
              </svg>
            </motion.div>
          </div>
        </div>
      </Container>
    </section>
  );
}
