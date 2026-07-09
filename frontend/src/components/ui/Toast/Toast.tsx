import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ToastProps } from './Toast.types';

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Toast-boilerplate', className)} {...props}>
        {children || 'Toast Component Boilerplate'}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
