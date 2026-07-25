"use client";
import React from 'react';
import { ArrowUpDown } from 'lucide-react';

export const SearchToolbar = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-3 sm:p-4 rounded-xl border border-gray-100 shadow-sm mb-6 animate-in slide-in-from-bottom-4 duration-700 fade-in delay-100">
      <div className="flex items-center gap-2">
        <ArrowUpDown className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Sắp xếp theo:</span>
      </div>
      
      <div className="flex flex-wrap items-center gap-2">
        {['Mới nhất', 'Bán chạy', 'Giá tăng dần', 'Giá giảm dần', 'Đánh giá'].map((sort, idx) => (
          <button 
            key={idx}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm font-medium transition-colors ${
              idx === 0 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-emerald-600'
            }`}
          >
            {sort}
          </button>
        ))}
      </div>
    </div>
  );
};
