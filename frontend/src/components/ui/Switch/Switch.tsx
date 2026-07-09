import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { SwitchProps } from './Switch.types';

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>(
  (
    {
      className,
      checked = false,
      onCheckedChange,
      label,
      helperText,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const switchId = id || generatedId;

    const handleClick = () => {
      if (!disabled && onCheckedChange) {
        onCheckedChange(!checked);
      }
    };

    return (
      <div className={cn('flex items-start gap-3', className)}>
        <button
          type="button"
          role="switch"
          id={switchId}
          aria-checked={checked}
          disabled={disabled}
          onClick={handleClick}
          ref={ref}
          className={cn(
            'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:cursor-not-allowed disabled:opacity-50',
            checked ? 'bg-[var(--color-primary)]' : 'bg-gray-200'
          )}
          {...props}
        >
          <span
            className={cn(
              'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform',
              checked ? 'translate-x-5' : 'translate-x-0'
            )}
          />
        </button>

        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={switchId}
                className={cn(
                  'text-sm font-medium select-none',
                  disabled ? 'text-[var(--color-disabled)] cursor-not-allowed' : 'text-[var(--color-text-primary)] cursor-pointer'
                )}
                onClick={handleClick}
              >
                {label}
              </label>
            )}
            {helperText && (
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{helperText}</p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Switch.displayName = 'Switch';
