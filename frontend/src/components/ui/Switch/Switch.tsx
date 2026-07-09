import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { SwitchProps } from './Switch.types';

export const Switch = forwardRef<HTMLDivElement, SwitchProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Switch-boilerplate', className)} {...props}>
        {children || 'Switch Component Boilerplate'}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
