import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';
import { RadioProps } from './Radio.types';

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
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
    const radioId = id || generatedId;

    return (
      <div className={cn('flex items-start gap-2.5', className)}>
        {/* Khung chứa Custom Radio tròn đều 100%, không bị méo lệch viền trái */}
        <div className="relative flex h-5 w-4 shrink-0 items-center justify-center">
          <input
            id={radioId}
            type="radio"
            ref={ref}
            disabled={disabled}
            className="peer absolute inset-0 z-10 h-full w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
            {...props}
          />
          <div
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white transition-all duration-150',
              'peer-hover:border-emerald-500',
              'peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-500/20 peer-focus-visible:border-emerald-500',
              'peer-checked:border-emerald-600 peer-checked:[&>span]:scale-100',
              'peer-disabled:cursor-not-allowed peer-disabled:bg-gray-100 peer-disabled:border-gray-200',
              error ? 'border-red-500 peer-focus-visible:ring-red-500/20' : ''
            )}
            aria-hidden="true"
          >
            <span className="h-2 w-2 rounded-full bg-emerald-600 scale-0 transition-transform duration-150 pointer-events-none" />
          </div>
        </div>
        
        {(label || helperText) && (
          <div className="flex flex-col">
            {label && (
              <label
                htmlFor={radioId}
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

Radio.displayName = 'Radio';
