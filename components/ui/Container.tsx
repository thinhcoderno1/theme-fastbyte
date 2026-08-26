import React from 'react';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}

export function Container({
  children,
  className = '',
  as: Component = 'div',
  ...props
}: ContainerProps) {
  return (
    <Component
      className={`mx-auto w-full max-w-[1200px] px-6 md:px-8 ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
