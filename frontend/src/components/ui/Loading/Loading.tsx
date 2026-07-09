import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/cn';
import { LoadingProps } from './Loading.types';

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  (
    {
      className,
      variant = 'spinner',
      size = 'md',
      colorClass = 'text-[var(--color-primary)]',
      value,
      ...props
    },
    ref
  ) => {
    if (variant === 'spinner') {
      const sizes = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8',
        xl: 'w-12 h-12',
      };

      return (
        <div ref={ref} className={cn('flex items-center justify-center', className)} {...props}>
          <Loader2 className={cn('animate-spin', sizes[size], colorClass)} />
        </div>
      );
    }

    if (variant === 'progress') {
      const isIndeterminate = value === undefined;
      
      return (
        <div
          ref={ref}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={isIndeterminate ? undefined : value}
          className={cn('relative w-full h-2 overflow-hidden rounded-full bg-[var(--color-primary-light)]', className)}
          {...props}
        >
          <div
            className={cn(
              'h-full bg-[var(--color-primary)] transition-all duration-300 ease-in-out',
              isIndeterminate ? 'w-full origin-left animate-[progress_1s_infinite_linear]' : ''
            )}
            style={{ width: isIndeterminate ? '100%' : `${value}%` }}
          />
        </div>
      );
    }

    return null;
  }
);

Loading.displayName = 'Loading';
