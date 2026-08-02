import React from 'react';
import { NewsArticle } from '@/mock/news';
import { NewsCard } from '@/components/news/NewsCard';

interface RelatedArticlesProps {
  articles: NewsArticle[];
}

export const RelatedArticles = ({ articles }: RelatedArticlesProps) => {
  if (articles.length === 0) return null;

  return (
    <div className="mt-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
        Bài viết liên quan
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article, idx) => (
          <div key={article.id} className="h-full" style={{ animationDelay: `${idx * 100}ms` }}>
            <NewsCard article={article} />
          </div>
        ))}
      </div>
    </div>
  );
};
