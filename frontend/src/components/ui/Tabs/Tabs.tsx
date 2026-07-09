import React, { forwardRef, useState } from 'react';
import { cn } from '@/utils/cn';
import { TabsProps } from './Tabs.types';

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      className,
      items,
      defaultActiveId,
      fullWidth = false,
      ...props
    },
    ref
  ) => {
    // Nếu không truyền defaultActiveId thì lấy phần tử đầu tiên
    const [activeId, setActiveId] = useState(defaultActiveId || items[0]?.id);

    return (
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        {/* Tab List */}
        <div className="flex w-full items-center justify-center rounded-lg bg-gray-100 p-1 text-[var(--color-text-secondary)]">
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                disabled={item.disabled}
                onClick={() => setActiveId(item.id)}
                className={cn(
                  'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/50 focus-visible:ring-offset-2',
                  fullWidth ? 'flex-1' : '',
                  item.disabled ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:bg-gray-200/50',
                  isActive
                    ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
                    : ''
                )}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="mt-4 ring-offset-white focus-visible:outline-none">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                'animate-in fade-in duration-300',
                activeId === item.id ? 'block' : 'hidden'
              )}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Tabs.displayName = 'Tabs';
