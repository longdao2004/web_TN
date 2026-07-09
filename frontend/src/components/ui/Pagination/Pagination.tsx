import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { PaginationProps } from './Pagination.types';

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Pagination-boilerplate', className)} {...props}>
        {children || 'Pagination Component Boilerplate'}
      </div>
    );
  }
);

Pagination.displayName = 'Pagination';
