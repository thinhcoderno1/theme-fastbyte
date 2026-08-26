import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
  variant?: 'brand' | 'gold' | 'success' | 'dark';
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
  className?: string;
}

export function Badge({
  children,
  variant = 'brand',
  size = 'md',
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 tracking-wider font-semibold',
    md: 'text-[12px] px-3 py-1 tracking-wider font-semibold',
  }[size];

  const variantClasses = {
    brand: 'bg-brand-50 text-brand-700 border border-brand-200/60',
    gold: 'bg-amber-50 text-amber-700 border border-amber-200',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    dark: 'bg-white/10 text-white border border-white/20 backdrop-blur-xs',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill uppercase ${sizeClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {icon && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
