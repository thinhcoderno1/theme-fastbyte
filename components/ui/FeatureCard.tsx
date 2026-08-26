import React from 'react';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  tag,
  className = '',
}: FeatureCardProps) {
  return (
    <div className={`group relative bg-surface border border-line rounded-lg p-6 md:p-7 card-hover-effect flex flex-col justify-between ${className}`}>
      <div>
        <div className="flex items-center justify-between mb-5">
          <div className="w-12 h-12 rounded-md bg-brand-50 text-brand-700 flex items-center justify-center shrink-0 border border-brand-100 group-hover:bg-brand-700 group-hover:text-white transition-colors duration-200">
            {icon}
          </div>
          {tag && (
            <span className="text-[11px] font-semibold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-0.5 rounded-pill">
              {tag}
            </span>
          )}
        </div>
        <h3 className="text-[19px] md:text-[20px] font-heading font-semibold text-ink-900 mb-2.5">
          {title}
        </h3>
        <p className="text-[15px] text-ink-500 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
}
