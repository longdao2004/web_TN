import React, { forwardRef, useState, useRef, useEffect } from 'react';
import { cn } from '@/utils/cn';
import { DropdownProps } from './Dropdown.types';

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  (
    {
      className,
      trigger,
      items,
      align = 'right',
      ...props
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Xử lý Click Outside để đóng Dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [isOpen]);

    return (
      <div className="relative inline-block text-left" ref={dropdownRef}>
        {/* Trigger */}
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {trigger}
        </div>

        {/* Menu Items */}
        {isOpen && (
          <div
            ref={ref}
            className={cn(
              'absolute z-50 mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
              'animate-in fade-in slide-in-from-top-2 duration-150',
              align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
              className
            )}
            {...props}
          >
            <div className="py-1">
              {items.map((item, index) => {
                if (item.divider) {
                  return <div key={index} className="my-1 border-t border-[var(--color-border)]" />;
                }

                return (
                  <button
                    key={index}
                    disabled={item.disabled}
                    onClick={() => {
                      if (item.onClick) item.onClick();
                      setIsOpen(false); // Auto close on click
                    }}
                    className={cn(
                      'flex w-full items-center px-4 py-2 text-sm text-left transition-colors',
                      item.disabled
                        ? 'text-[var(--color-disabled)] cursor-not-allowed'
                        : item.danger
                        ? 'text-[var(--color-danger)] hover:bg-red-50'
                        : 'text-[var(--color-text-primary)] hover:bg-gray-100'
                    )}
                  >
                    {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
