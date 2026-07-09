import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { TableProps } from './Table.types';

export const Table = forwardRef<HTMLDivElement, TableProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Table-boilerplate', className)} {...props}>
        {children || 'Table Component Boilerplate'}
      </div>
    );
  }
);

Table.displayName = 'Table';
