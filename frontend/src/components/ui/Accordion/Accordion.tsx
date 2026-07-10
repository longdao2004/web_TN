"use client";
import React, { forwardRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import { AccordionProps } from './Accordion.types';

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, items, allowMultiple = false, ...props }, ref) => {
    const [openItems, setOpenItems] = useState<string[]>([]);

    const toggleItem = (id: string) => {
      if (allowMultiple) {
        setOpenItems((prev) =>
          prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
      } else {
        setOpenItems((prev) => (prev.includes(id) ? [] : [id]));
      }
    };

    return (
      <div ref={ref} className={cn('w-full divide-y divide-[var(--color-border)] rounded-lg border border-[var(--color-border)] bg-white', className)} {...props}>
        {items.map((item) => {
          const isOpen = openItems.includes(item.id);
          return (
            <div key={item.id} className="w-full">
              <button
                type="button"
                className="flex w-full items-center justify-between px-4 py-4 text-sm font-medium transition-all hover:bg-gray-50 focus:outline-none"
                onClick={() => toggleItem(item.id)}
              >
                <span className="text-[var(--color-text-primary)]">{item.title}</span>
                <ChevronDown
                  className={cn(
                    'h-4 w-4 shrink-0 text-[var(--color-text-secondary)] transition-transform duration-200',
                    isOpen && 'rotate-180'
                  )}
                />
              </button>
              
              <div
                className={cn(
                  'overflow-hidden text-sm transition-all duration-300 ease-in-out',
                  isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                )}
              >
                <div className="px-4 pb-4 pt-1 text-[var(--color-text-secondary)]">
                  {item.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

