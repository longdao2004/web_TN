import React from 'react';
import { newsCategories } from '@/mock/news';

interface NewsCategoriesProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
}

export const NewsCategories = ({ activeCategory, onSelectCategory }: NewsCategoriesProps) => {
  return (
    <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-left-8 duration-700">
      {newsCategories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelectCategory(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
            activeCategory === cat
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-md'
              : 'bg-white text-gray-700 border-gray-200 hover:border-emerald-300 hover:text-emerald-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};
