import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { DialogProps } from './Dialog.types';

export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Dialog-boilerplate', className)} {...props}>
        {children || 'Dialog Component Boilerplate'}
      </div>
    );
  }
);

Dialog.displayName = 'Dialog';
