import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('EmptyState-boilerplate', className)} {...props}>
        {children || 'EmptyState Component Boilerplate'}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
