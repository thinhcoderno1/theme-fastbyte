'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface BenchmarkImagePreviewProps {
  src: string;
  alt: string;
  metricValue: string;
}

type PreviewMode = 'hover' | 'click' | null;

export function BenchmarkImagePreview({ src, alt, metricValue }: BenchmarkImagePreviewProps) {
  const [previewMode, setPreviewMode] = useState<PreviewMode>(null);

  useEffect(() => {
    if (!previewMode) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setPreviewMode(null);
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [previewMode]);

  const supportsHover = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  const openFromHover = () => {
    if (supportsHover()) setPreviewMode('hover');
  };

  const closeFromHover = () => {
    if (previewMode === 'hover') setPreviewMode(null);
  };

  const openFromClick = () => {
    if (!supportsHover()) setPreviewMode('click');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setPreviewMode('click');
    }
  };

  return (
    <>
      <div
        className="relative aspect-video w-full cursor-zoom-in overflow-hidden border-b border-line bg-ink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-400"
        onMouseEnter={openFromHover}
        onMouseLeave={closeFromHover}
        onClick={openFromClick}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Phóng to ảnh ${alt}`}
        aria-expanded={Boolean(previewMode)}
      >
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          loading="lazy"
          className="object-contain object-center"
        />
        <div className="absolute right-3 top-3 rounded-sm border border-brand-700/80 bg-brand-900/90 px-2.5 py-1 font-mono text-[12px] font-bold text-accent-400">
          {metricValue}
        </div>
      </div>

      {typeof document !== 'undefined' && previewMode
        ? createPortal(
            <div
              className={`fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-3 backdrop-blur-sm sm:p-6 ${
                previewMode === 'hover' ? 'pointer-events-none' : 'cursor-zoom-out'
              }`}
              onClick={() => previewMode === 'click' && setPreviewMode(null)}
              role={previewMode === 'click' ? 'dialog' : undefined}
              aria-modal={previewMode === 'click' ? true : undefined}
              aria-label={previewMode === 'click' ? `Xem ảnh lớn ${alt}` : undefined}
            >
              <div className="relative h-[84vh] w-[94vw] max-w-[1440px]">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="94vw"
                  className="object-contain object-center drop-shadow-2xl"
                  priority
                />
              </div>

              {previewMode === 'click' && (
                <button
                  type="button"
                  onClick={() => setPreviewMode(null)}
                  className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/60 text-white transition-colors hover:bg-black/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
                  aria-label="Đóng ảnh phóng to"
                >
                  <X strokeWidth={2.2} size={24} />
                </button>
              )}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
