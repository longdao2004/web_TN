import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { RadioProps } from './Radio.types';

export const Radio = forwardRef<HTMLDivElement, RadioProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Radio-boilerplate', className)} {...props}>
        {children || 'Radio Component Boilerplate'}
      </div>
    );
  }
);

Radio.displayName = 'Radio';
