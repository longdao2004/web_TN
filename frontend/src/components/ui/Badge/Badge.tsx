import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { BadgeProps } from './Badge.types';

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Badge-boilerplate', className)} {...props}>
        {children || 'Badge Component Boilerplate'}
      </div>
    );
  }
);

Badge.displayName = 'Badge';
