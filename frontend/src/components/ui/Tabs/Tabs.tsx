import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { TabsProps } from './Tabs.types';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Tabs-boilerplate', className)} {...props}>
        {children || 'Tabs Component Boilerplate'}
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
