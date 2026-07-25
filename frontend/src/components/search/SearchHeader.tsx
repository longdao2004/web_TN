import React from 'react';

interface SearchHeaderProps {
  query: string;
  totalResults: number;
}

export const SearchHeader = ({ query, totalResults }: SearchHeaderProps) => {
  return (
    <div className="mb-6 sm:mb-8 animate-in fade-in duration-700">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
        Tìm thấy <span className="font-bold text-[var(--color-primary)]">{totalResults}</span> sản phẩm cho từ khóa &quot;<span className="font-bold">{query}</span>&quot;
      </h1>
      <p className="text-sm text-gray-500 mt-2">
        Khám phá các sản phẩm tươi ngon, an toàn từ những nhà vườn uy tín.
      </p>
    </div>
  );
};
