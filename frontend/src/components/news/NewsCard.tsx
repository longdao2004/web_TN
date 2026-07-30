import React from 'react';
import Link from 'next/link';
import { Calendar, User, Clock } from 'lucide-react';
import { NewsArticle } from '@/mock/news';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <Link href={`/tin-tuc/${article.slug}`} className="group h-full">
      <article className="h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative h-56 overflow-hidden">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-emerald-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
            {article.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {article.publishedAt}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime}
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
            {article.description}
          </p>

          <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                <User className="w-3 h-3 text-gray-500" />
              </div>
              {article.author}
            </div>
            
            <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-500 transition-colors">
              Đọc tiếp &rarr;
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};
