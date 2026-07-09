import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { AvatarProps } from './Avatar.types';

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('Avatar-boilerplate', className)} {...props}>
        {children || 'Avatar Component Boilerplate'}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
