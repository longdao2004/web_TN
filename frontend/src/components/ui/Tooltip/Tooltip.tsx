import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { TooltipProps } from './Tooltip.types';

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Tooltip-boilerplate', className)} {...props}>
        {children || 'Tooltip Component Boilerplate'}
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
