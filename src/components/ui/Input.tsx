import React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, helperText, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <input
          type={type}
          suppressHydrationWarning
          className={cn(
            'flex h-10 w-full rounded-xl border-0 ring-1 ring-yellow-200/40 bg-yellow-100/60 backdrop-blur-xl px-3 py-2 text-sm',
            'ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300/50 focus-visible:ring-offset-0 focus-visible:bg-yellow-100/70',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300',
            error && 'ring-destructive/30 focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        />
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
