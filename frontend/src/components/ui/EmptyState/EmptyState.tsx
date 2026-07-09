import React, { forwardRef } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/utils/cn';
import { EmptyStateProps } from './EmptyState.types';

export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      icon,
      title,
      description,
      action,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center text-center p-8 w-full min-h-[300px] border border-dashed border-[var(--color-border)] rounded-xl bg-gray-50/50', className)}
        {...props}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 mb-4 text-gray-400">
          {icon || <Inbox className="h-8 w-8" />}
        </div>
        <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-[var(--color-text-secondary)] max-w-sm mb-6">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
