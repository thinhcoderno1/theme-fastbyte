'use client';

import React, { Children, useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MobilePlanCarouselProps {
  children: React.ReactNode;
  ariaLabel: string;
  desktopGridClassName: string;
}

export function MobilePlanCarousel({
  children,
  ariaLabel,
  desktopGridClassName,
}: MobilePlanCarouselProps) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const slides = Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveIndex = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const slideElements = Array.from(
      viewport.querySelectorAll<HTMLElement>('[data-plan-slide]'),
    );
    if (slideElements.length === 0) return;

    const closestIndex = slideElements.reduce((closest, slide, index) => {
      const currentDistance = Math.abs(slide.offsetLeft - viewport.scrollLeft);
      const closestDistance = Math.abs(
        slideElements[closest].offsetLeft - viewport.scrollLeft,
      );
      return currentDistance < closestDistance ? index : closest;
    }, 0);

    setActiveIndex(closestIndex);
  }, []);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    let animationFrame = 0;
    const handleScroll = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(updateActiveIndex);
    };

    viewport.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateActiveIndex);
    updateActiveIndex();

    return () => {
      cancelAnimationFrame(animationFrame);
      viewport.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateActiveIndex);
    };
  }, [updateActiveIndex]);

  const scrollToSlide = (index: number) => {
    const viewport = viewportRef.current;
    const slide = viewport?.querySelectorAll<HTMLElement>('[data-plan-slide]')[index];
    if (!viewport || !slide) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    viewport.scrollTo({
      left: slide.offsetLeft,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      scrollToSlide(Math.max(0, activeIndex - 1));
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      scrollToSlide(Math.min(slides.length - 1, activeIndex + 1));
    }
  };

  return (
    <div>
      <div
        ref={viewportRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className={`mobile-plan-carousel flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 pt-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-4 md:grid md:snap-none md:overflow-visible md:pb-0 md:pt-0 md:ring-0 ${desktopGridClassName}`}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            data-plan-slide
            role="group"
            aria-label={`Gói ${index + 1} trên ${slides.length}`}
            className="w-full min-w-0 shrink-0 snap-start md:w-auto md:shrink md:snap-none"
          >
            {slide}
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-4 md:hidden">
          <button
            type="button"
            onClick={() => scrollToSlide(Math.max(0, activeIndex - 1))}
            disabled={activeIndex === 0}
            aria-label="Xem gói trước"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brand-700 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronLeft size={20} strokeWidth={2.4} aria-hidden="true" />
          </button>

          <div className="flex max-w-[180px] flex-wrap justify-center gap-1.5" aria-label="Chọn gói VPS">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToSlide(index)}
                aria-label={`Xem gói ${index + 1}`}
                aria-current={activeIndex === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-[width,background-color] ${
                  activeIndex === index ? 'w-5 bg-brand-700' : 'w-2 bg-brand-200 hover:bg-brand-400'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => scrollToSlide(Math.min(slides.length - 1, activeIndex + 1))}
            disabled={activeIndex === slides.length - 1}
            aria-label="Xem gói tiếp theo"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-brand-700 shadow-sm transition-colors hover:border-brand-300 hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-35"
          >
            <ChevronRight size={20} strokeWidth={2.4} aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
