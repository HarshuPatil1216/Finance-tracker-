import React from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  multiline?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement & HTMLTextAreaElement, InputProps>(
  ({ label, error, className, multiline, ...props }, ref) => {
    const inputClasses = cn(
      'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
      error && 'border-red-500 focus-visible:ring-red-500',
      className
    );

    return (
      <div className="w-full space-y-1.5">
        {label && <label className="text-sm font-semibold text-slate-700 ml-1">{label}</label>}
        {multiline ? (
          <textarea className={cn(inputClasses, 'h-24 resize-none')} ref={ref as any} {...(props as any)} />
        ) : (
          <input className={inputClasses} ref={ref as any} {...(props as any)} />
        )}
        {error && <p className="text-xs text-red-500 ml-1 font-medium">{error}</p>}
      </div>
    );
  }
);
