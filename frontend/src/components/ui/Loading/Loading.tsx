import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { LoadingProps } from './Loading.types';

export const Loading = forwardRef<HTMLDivElement, LoadingProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Loading-boilerplate', className)} {...props}>
        {children || 'Loading Component Boilerplate'}
      </div>
    );
  }
);

Loading.displayName = 'Loading';
