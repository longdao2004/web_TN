import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { InputProps } from './Input.types';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      fullWidth = true,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {props.required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 flex items-center text-[var(--color-text-secondary)] pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Actual Input */}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors',
              'placeholder:text-[var(--color-disabled)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)]',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-[var(--color-disabled)]',
              // Dynamic Paddings based on icons
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              // Error state
              error ? 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/20 focus-visible:border-[var(--color-danger)]' : 'border-[var(--color-border)]'
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-[var(--color-text-secondary)]">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {error ? (
          <p className="text-xs text-[var(--color-danger)] mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
