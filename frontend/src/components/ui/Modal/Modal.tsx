import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { ModalProps } from './Modal.types';

export const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Modal-boilerplate', className)} {...props}>
        {children || 'Modal Component Boilerplate'}
      </div>
    );
  }
);

Modal.displayName = 'Modal';
