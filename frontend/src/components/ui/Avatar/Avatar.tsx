import React, { forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AvatarProps } from './Avatar.types';

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  (
    {
      className,
      src,
      alt = 'Avatar',
      fallback,
      size = 'md',
      rounded = true,
      ...props
    },
    ref
  ) => {
    const [imageError, setImageError] = useState(false);

    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-10 h-10 text-sm',
      lg: 'w-12 h-12 text-base',
      xl: 'w-16 h-16 text-lg',
    };

    const getInitials = (name: string) => {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex shrink-0 items-center justify-center overflow-hidden bg-gray-100 text-[var(--color-text-secondary)] font-medium border border-white shadow-sm',
          sizes[size],
          rounded ? 'rounded-full' : 'rounded-lg',
          className
        )}
      >
        {src && !imageError ? (
          <img
            src={src}
            alt={alt}
            onError={() => setImageError(true)}
            className="aspect-square h-full w-full object-cover"
            {...props}
          />
        ) : fallback ? (
          <span>{getInitials(fallback)}</span>
        ) : (
          <User className={cn('text-gray-400', size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6')} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
