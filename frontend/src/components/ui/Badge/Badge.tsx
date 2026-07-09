import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { BadgeProps } from './Badge.types';

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      icon,
      children,
      ...props
    },
    ref
  ) => {
    // Các class cơ bản
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-full';

    // Biến thể theo Soft Design System (Nền nhạt, chữ đậm)
    const variants = {
      primary: 'bg-blue-100 text-blue-700',
      secondary: 'bg-[var(--color-primary-light)] text-[var(--color-primary-hover)]',
      success: 'bg-emerald-100 text-emerald-700',
      warning: 'bg-amber-100 text-amber-700',
      danger: 'bg-red-100 text-red-700',
      neutral: 'bg-gray-100 text-gray-700',
      outline: 'bg-white border border-[var(--color-border)] text-[var(--color-text-secondary)]',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-[10px]',
      md: 'px-2.5 py-0.5 text-xs',
    };

    return (
      <div
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {icon && <span className="mr-1 -ml-0.5 flex items-center">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
