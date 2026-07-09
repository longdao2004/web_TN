import React, { forwardRef } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/utils/cn';
import { ToastProps } from './Toast.types';

export const Toast = forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      title,
      description,
      variant = 'info',
      onClose,
      ...props
    },
    ref
  ) => {
    const icons = {
      success: <CheckCircle2 className="h-5 w-5 text-emerald-500" />,
      error: <AlertCircle className="h-5 w-5 text-red-500" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-500" />,
      info: <Info className="h-5 w-5 text-blue-500" />,
    };

    const borders = {
      success: 'border-l-4 border-emerald-500',
      error: 'border-l-4 border-red-500',
      warning: 'border-l-4 border-amber-500',
      info: 'border-l-4 border-blue-500',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg bg-white p-4 shadow-lg ring-1 ring-black ring-opacity-5',
          'animate-in slide-in-from-right-full fade-in duration-300',
          borders[variant],
          className
        )}
        {...props}
      >
        {/* Icon */}
        <div className="shrink-0 pt-0.5">{icons[variant]}</div>

        {/* Content */}
        <div className="flex-1 w-0">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">{title}</p>
          {description && (
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
          )}
        </div>

        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="shrink-0 ml-4 rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20"
          >
            <span className="sr-only">Đóng</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Toast.displayName = 'Toast';
