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
            className="text-sm font-medium text-gray-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        {/* Input Wrapper */}
        <div className="relative flex items-center">
          {/* Left Icon */}
          {leftIcon && (
            <div className="absolute left-3 flex items-center text-gray-400 pointer-events-none">
              {leftIcon}
            </div>
          )}

          {/* Actual Input */}
          <input
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              'flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 transition-colors',
              'placeholder:text-gray-400',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600',
              'disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400',
              // Dynamic Paddings based on icons
              leftIcon ? 'pl-10' : '',
              rightIcon ? 'pr-10' : '',
              // Error state
              error ? 'border-red-500 focus-visible:ring-red-500/20 focus-visible:border-red-500' : 'border-gray-200'
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 flex items-center text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>

        {/* Helper Text or Error Message */}
        {error ? (
          <p className="text-xs text-red-500 mt-0.5">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-gray-500 mt-0.5">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';