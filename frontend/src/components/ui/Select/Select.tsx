import React, { forwardRef, useId } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SelectProps } from './Select.types';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      options,
      fullWidth = true,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const selectId = id || generatedId;

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth ? 'w-full' : '', className)}>
        {/* Label */}
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-[var(--color-text-primary)]"
          >
            {label}
            {props.required && <span className="text-[var(--color-danger)] ml-1">*</span>}
          </label>
        )}

        {/* Select Wrapper */}
        <div className="relative flex items-center">
          <select
            id={selectId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-[var(--color-text-primary)] transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)]',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-[var(--color-disabled)]',
              // Error state
              error ? 'border-[var(--color-danger)] focus-visible:ring-[var(--color-danger)]/20 focus-visible:border-[var(--color-danger)]' : 'border-[var(--color-border)]'
            )}
            {...props}
          >
            <option value="" disabled hidden>
              {props.placeholder || 'Vui lòng chọn...'}
            </option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>

          {/* Custom Arrow Icon */}
          <div className="absolute right-3 flex items-center pointer-events-none text-[var(--color-text-secondary)]">
            <ChevronDown className="w-4 h-4" />
          </div>
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

Select.displayName = 'Select';
