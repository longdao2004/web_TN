import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { BreadcrumbProps } from './Breadcrumb.types';

export const Breadcrumb = forwardRef<HTMLDivElement, BreadcrumbProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Breadcrumb-boilerplate', className)} {...props}>
        {children || 'Breadcrumb Component Boilerplate'}
      </div>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';
