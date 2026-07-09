import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef<HTMLDivElement, CheckboxProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Checkbox-boilerplate', className)} {...props}>
        {children || 'Checkbox Component Boilerplate'}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
