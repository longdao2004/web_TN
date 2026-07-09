import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { CheckboxProps } from './Checkbox.types';

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const checkboxId = id || generatedId;

    return (
      <div className={cn('flex items-start gap-2', className)}>
        <div className="flex h-5 items-center">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className={cn(
              'h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-primary)] transition-colors',
              'focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:ring-offset-0',
              'disabled:cursor-not-allowed disabled:bg-gray-200 disabled:border-gray-300',
              error ? 'border-[var(--color-danger)] text-[var(--color-danger)] focus:ring-[var(--color-danger)]/20' : ''
            )}
            {...props}
          />
        </div>
        
        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium select-none',
                  disabled ? 'text-[var(--color-disabled)] cursor-not-allowed' : 'text-[var(--color-text-primary)] cursor-pointer'
                )}
              >
                {label}
                {props.required && <span className="text-[var(--color-danger)] ml-1">*</span>}
              </label>
            )}
            {error ? (
              <p className="text-xs text-[var(--color-danger)] mt-0.5">{error}</p>
            ) : helperText ? (
              <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
