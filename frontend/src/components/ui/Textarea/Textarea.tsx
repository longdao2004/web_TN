import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { TextareaProps } from './Textarea.types';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      fullWidth = true,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const textareaId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {props.required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Textarea Wrapper */}
        <div className="relative flex">
          <textarea
            id={textareaId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex min-h-[80px] w-full rounded-lg border bg-white px-3 py-2 text-sm text-[var(--color-text-primary)] transition-colors',
              'placeholder:text-[var(--color-disabled)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)]',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-[var(--color-disabled)]',
              // Error state
              error ? 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/20 focus-visible:border-[var(--color-danger)]' : 'border-[var(--color-border)]'
            )}
            {...props}
          />
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

Textarea.displayName = 'Textarea';
