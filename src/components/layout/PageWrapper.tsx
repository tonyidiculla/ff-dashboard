import React from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: React.ReactNode;
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'pink' | 'cyan';
  className?: string;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ 
  children, 
  color = 'blue',
  className 
}) => {
  // Use subtle pastel colors with soft gradients (reduced saturation)
  const colorClasses = {
    blue: 'bg-gradient-to-br from-pastel-sky/70 via-pastel-blue/80 to-pastel-indigo/60',
    green: 'bg-gradient-to-br from-pastel-green-light/70 via-pastel-green/80 to-pastel-cyan/60',
    purple: 'bg-gradient-to-br from-pastel-rose/70 via-pastel-purple/80 to-pastel-violet/60',
    orange: 'bg-gradient-to-br from-pastel-pink-light/70 via-pastel-orange/80 to-pastel-orange-rich/60',
    pink: 'bg-gradient-to-br from-pastel-rose/80 via-pastel-pink/90 to-pastel-purple-rich/70',
    cyan: 'bg-gradient-to-br from-pastel-sky/70 via-pastel-cyan/80 to-pastel-blue-rich/60',
  };

  return (
    <div className={cn('min-h-full relative', className)}>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};
