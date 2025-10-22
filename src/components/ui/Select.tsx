import React from 'react';
import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, helperText, options, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1.5">
            {label}
            {props.required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}
        <select
          suppressHydrationWarning
          className={cn(
            'flex h-10 w-full rounded-xl border-0 ring-1 ring-red-200/40 bg-red-100/50 backdrop-blur-xl px-3 py-2 text-sm',
            'ring-offset-background',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300/50 focus-visible:ring-offset-0 focus-visible:bg-red-100/60',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'transition-all duration-300',
            error && 'ring-destructive/30 focus-visible:ring-destructive',
            className
          )}
          ref={ref}
          {...props}
        >
          <option value="">Select an option</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-muted-foreground mt-1">{helperText}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
