import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { CardProps } from './Card.types';

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Card-boilerplate', className)} {...props}>
        {children || 'Card Component Boilerplate'}
      </div>
    );
  }
);

Card.displayName = 'Card';
