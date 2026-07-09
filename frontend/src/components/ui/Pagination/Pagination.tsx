import React, { forwardRef } from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/utils/cn';
import { PaginationProps } from './Pagination.types';
import { Button } from '../Button';

export const Pagination = forwardRef<HTMLDivElement, PaginationProps>(
  (
    {
      className,
      currentPage,
      totalPages,
      onPageChange,
      showText = false,
      ...props
    },
    ref
  ) => {
    // Generate page numbers with ellipsis
    const getPageNumbers = () => {
      const pages: (number | string)[] = [];
      if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
      } else {
        if (currentPage <= 4) {
          pages.push(1, 2, 3, 4, 5, '...', totalPages);
        } else if (currentPage >= totalPages - 3) {
          pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
        }
      }
      return pages;
    };

    if (totalPages <= 1) return null;

    return (
      <nav
        role="navigation"
        aria-label="pagination"
        ref={ref}
        className={cn('mx-auto flex w-full justify-center', className)}
        {...props}
      >
        <ul className="flex flex-row items-center gap-1">
          {/* Prev Button */}
          <li>
            <Button
              variant="ghost"
              size={showText ? 'md' : 'icon'}
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              aria-label="Go to previous page"
              className={cn("gap-1", showText ? "pl-2.5" : "")}
            >
              <ChevronLeft className="h-4 w-4" />
              {showText && <span>Trước</span>}
            </Button>
          </li>

          {/* Page Numbers */}
          {getPageNumbers().map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span aria-hidden className="flex h-9 w-9 items-center justify-center">
                  <MoreHorizontal className="h-4 w-4 text-[var(--color-text-secondary)]" />
                </span>
              ) : (
                <Button
                  variant={currentPage === page ? 'primary' : 'ghost'}
                  size="icon"
                  className="w-9 h-9"
                  aria-current={currentPage === page ? 'page' : undefined}
                  onClick={() => onPageChange(page as number)}
                >
                  {page}
                </Button>
              )}
            </li>
          ))}

          {/* Next Button */}
          <li>
            <Button
              variant="ghost"
              size={showText ? 'md' : 'icon'}
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              aria-label="Go to next page"
              className={cn("gap-1", showText ? "pr-2.5" : "")}
            >
              {showText && <span>Sau</span>}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </li>
        </ul>
      </nav>
    );
  }
);

Pagination.displayName = 'Pagination';
