import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { SkeletonProps } from './Skeleton.types';

export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-pulse rounded-md bg-gray-200/80', className)}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';
