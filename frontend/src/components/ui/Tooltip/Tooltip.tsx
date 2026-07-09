import React, { forwardRef } from 'react';
import { cn } from '@/utils/cn';
import { TooltipProps } from './Tooltip.types';

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  (
    {
      className,
      content,
      children,
      position = 'top',
      ...props
    },
    ref
  ) => {
    const positionClasses = {
      top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
      left: 'right-full top-1/2 -translate-y-1/2 mr-2',
      right: 'left-full top-1/2 -translate-y-1/2 ml-2',
    };

    const arrowClasses = {
      top: 'bottom-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
      bottom: 'top-[-4px] left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
      left: 'right-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
      right: 'left-[-4px] top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent',
    };

    return (
      <div className="relative inline-block group" ref={ref} {...props}>
        {/* Children that triggers the tooltip */}
        {children}

        {/* Tooltip Content Wrapper */}
        <div
          className={cn(
            'absolute z-50 whitespace-nowrap rounded-md bg-gray-900 px-2.5 py-1.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none',
            positionClasses[position],
            className
          )}
          role="tooltip"
        >
          {content}
          
          {/* Arrow */}
          <div
            className={cn(
              'absolute border-[5px] border-gray-900',
              arrowClasses[position]
            )}
          />
        </div>
      </div>
    );
  }
);

Tooltip.displayName = 'Tooltip';
