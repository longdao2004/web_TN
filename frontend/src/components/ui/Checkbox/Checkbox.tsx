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
      <div className={cn('flex items-start gap-2.5', className)}>
        {/* Khung chứa Custom Checkbox với 4 cạnh đều nét 100%, không bị lẹm viền trái */}
        <div className="relative flex h-5 w-4 shrink-0 items-center justify-center">
          <input
            id={checkboxId}
            type="checkbox"
            ref={ref}
            disabled={disabled}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <div
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded border border-gray-300 bg-white transition-all duration-150',
              'peer-hover:border-emerald-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/20 peer-focus-visible:border-emerald-500',
              'peer-checked:border-emerald-600 peer-checked:bg-emerald-600 peer-checked:[&>svg]:opacity-100',
              'peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:border-gray-200',
              error ? 'border-red-500 peer-focus-visible:ring-red-500/20' : ''
            )}
            aria-hidden="true"
          >
            <svg
              className="h-2.5 w-2.5 text-white opacity-0 transition-opacity duration-150 pointer-events-none"
              viewBox="0 0 12 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="2.5 6 5 8.5 9.5 3.5" />
            </svg>
          </div>
        </div>
        
        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={checkboxId}
                className={cn(
                  'text-sm font-medium select-none',
                  disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'
                )}
              >
                {label}
                {props.required && <span className="text-red-500 ml-1">*</span>}
              </label>
            )}
            {error ? (
              <p className="text-xs text-red-500 mt-0.5">{error}</p>
            ) : helperText ? (
              <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>
            ) : null}
          </div>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
