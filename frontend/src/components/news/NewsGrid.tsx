import React from 'react';
import { NewsArticle } from '@/mock/news';
import { NewsCard } from './NewsCard';

interface NewsGridProps {
  articles: NewsArticle[];
}

export const NewsGrid = ({ articles }: NewsGridProps) => {
  if (articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Không tìm thấy bài viết nào cho danh mục này.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
      {articles.map((article, idx) => (
        <div 
          key={article.id} 
          className="animate-in slide-in-from-bottom-4" 
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
};
