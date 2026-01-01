'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, type = 'text', id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary mb-1.5">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full px-4 py-2.5 border rounded-lg bg-white text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200',
            error
              ? 'border-coral-dark focus:ring-coral-dark'
              : 'border-beige focus:ring-sage',
            className
          )}
          {...props}
        />
        {hint && !error && (
          <p className="mt-1 text-sm text-text-muted">{hint}</p>
        )}
        {error && (
          <p className="mt-1 text-sm text-coral-dark">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
