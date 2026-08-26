import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'dark-primary' | 'dark-outline';
  size?: 'sm' | 'md' | 'lg';
  as?: React.ElementType;
  href?: string;
  target?: string;
  rel?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  target,
  rel,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  // Base classes according to Design System
  const baseClasses = 'inline-flex items-center justify-center font-body font-semibold transition-all duration-180 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

  // Size classes
  const sizeClasses = {
    sm: 'text-[13px] px-3.5 py-2 rounded-md h-[36px] gap-1.5',
    md: 'text-[15px] px-5 py-3 rounded-md h-[44px] gap-2',
    lg: 'text-[16px] px-6 py-3.5 rounded-md h-[48px] gap-2.5',
  }[size];

  // Variant classes
  const variantClasses = {
    primary: 'bg-brand-700 text-white hover:bg-brand-800 shadow-sm border border-transparent active:scale-[0.99]',
    secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 border border-brand-100 active:scale-[0.99]',
    outline: 'bg-transparent text-ink-900 border border-line-strong hover:bg-surface-subtle hover:border-ink-400 active:scale-[0.99]',
    'dark-primary': 'bg-white text-brand-700 hover:bg-brand-50 shadow-md border border-transparent font-bold active:scale-[0.99]',
    'dark-outline': 'bg-transparent text-white border border-white/80 hover:bg-white/10 hover:border-white active:scale-[0.99]',
  }[variant];

  const combinedClasses = `${baseClasses} ${sizeClasses} ${variantClasses} ${className}`;

  if (href) {
    return (
      <a
        href={href}
        target={target}
        rel={target === '_blank' ? 'noopener noreferrer' : rel}
        className={combinedClasses}
        {...(props as any)}
      >
        {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
        <span>{children}</span>
        {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
      </a>
    );
  }

  const Component = as;
  return (
    <Component
      className={combinedClasses}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="inline-flex shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="inline-flex shrink-0">{icon}</span>}
    </Component>
  );
}
