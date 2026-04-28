import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
  key?: React.Key;
}

export const Card = ({ children, className, title, subtitle, headerAction, ...props }: CardProps) => {
  return (
    <div 
      className={cn('card-premium', className)}
      {...props}
    >
      {(title || headerAction) && (
        <div className="px-8 py-5 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
          <div>
            {title && <h3 className="font-bold text-[#111827] dark:text-white tracking-tight">{title}</h3>}
            {subtitle && <p className="text-xs text-secondary mt-1 font-medium">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      <div className="p-8">{children}</div>
    </div>
  );
};
