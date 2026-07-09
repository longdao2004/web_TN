import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { DropdownProps } from './Dropdown.types';

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Dropdown-boilerplate', className)} {...props}>
        {children || 'Dropdown Component Boilerplate'}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
