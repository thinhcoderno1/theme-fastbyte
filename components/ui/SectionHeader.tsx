import React from 'react';

interface SectionHeaderProps {
  overline?: string;
  title: string;
  subtitle?: string;
  align?: 'center' | 'left';
  className?: string;
  id?: string;
}

export function SectionHeader({
  overline,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeaderProps) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto' : 'text-left'} ${className}`}>
      {overline && (
        <div className={`inline-block mb-2.5 text-[13px] font-semibold uppercase tracking-[0.06em] text-brand-700 font-heading`}>
          {overline}
        </div>
      )}
      <h2 className="text-ink-900 font-heading font-bold text-balance mb-4">
        {title}
      </h2>
      {subtitle && (
        <p className={`text-ink-500 text-[16px] md:text-[18px] leading-relaxed text-balance ${isCenter ? 'mx-auto max-w-2xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
