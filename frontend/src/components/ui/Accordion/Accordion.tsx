import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { AccordionProps } from './Accordion.types';

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Accordion-boilerplate', className)} {...props}>
        {children || 'Accordion Component Boilerplate'}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';
