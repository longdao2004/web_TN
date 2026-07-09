import React, { forwardRef, useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { SearchBoxProps } from './SearchBox.types';

export const SearchBox = forwardRef<HTMLInputElement, SearchBoxProps>(
  (
    {
      className,
      placeholder = 'Tìm kiếm...',
      onSearch,
      variant = 'outline',
      fullWidth = true,
      value: propValue,
      onChange,
      ...props
    },
    ref
  ) => {
    const [searchValue, setSearchValue] = useState(propValue || '');

    useEffect(() => {
      if (propValue !== undefined) {
        setSearchValue(propValue);
      }
    }, [propValue]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      if (onChange) onChange(e);
    };

    const handleClear = () => {
      setSearchValue('');
      if (onSearch) onSearch('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' && onSearch) {
        onSearch(searchValue as string);
      }
    };

    return (
      <div className={cn('relative flex items-center', fullWidth ? 'w-full' : 'w-auto', className)}>
        {/* Search Icon */}
        <div className="absolute left-3 flex items-center text-[var(--color-text-secondary)] pointer-events-none">
          <Search className="w-4 h-4" />
        </div>

        {/* Input Field */}
        <input
          ref={ref}
          type="text"
          value={searchValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={cn(
            'flex h-10 w-full rounded-full border px-10 py-2 text-sm text-[var(--color-text-primary)] transition-colors',
            'placeholder:text-[var(--color-disabled)]',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 focus-visible:border-[var(--color-primary)]',
            variant === 'filled' ? 'bg-gray-100 border-transparent focus-visible:bg-white' : 'bg-white border-[var(--color-border)]'
          )}
          {...props}
        />

        {/* Clear Button */}
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 flex items-center text-[var(--color-text-secondary)] hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

SearchBox.displayName = 'SearchBox';
