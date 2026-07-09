import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { SkeletonProps } from './Skeleton.types';

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Skeleton-boilerplate', className)} {...props}>
        {children || 'Skeleton Component Boilerplate'}
      </div>
    );
  }
);

Skeleton.displayName = 'Skeleton';
