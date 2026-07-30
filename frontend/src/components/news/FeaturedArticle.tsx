import React from 'react';
import Link from 'next/link';
import { ArrowRight, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui';
import { featuredNews } from '@/mock/news';

export const FeaturedArticle = () => {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl group animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="flex flex-col lg:flex-row h-full">
        {/* Image */}
        <div className="lg:w-1/2 relative overflow-hidden h-[300px] lg:h-auto">
          <img 
            src={featuredNews.image} 
            alt={featuredNews.title} 
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
        </div>

        {/* Content */}
        <div className="lg:w-1/2 bg-white p-8 lg:p-12 flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
              {featuredNews.category}
            </span>
          </div>
          
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-900 mb-4 line-clamp-3 hover:text-emerald-600 transition-colors">
            <Link href={`/tin-tuc/${featuredNews.slug}`}>
              {featuredNews.title}
            </Link>
          </h2>
          
          <p className="text-gray-600 mb-6 text-lg line-clamp-3">
            {featuredNews.description}
          </p>
          
          <div className="flex items-center gap-6 text-sm text-gray-500 mb-8">
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4" />
              {featuredNews.author}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {featuredNews.publishedAt}
            </div>
          </div>
          
          <div>
            <Link href={`/tin-tuc/${featuredNews.slug}`}>
              <Button className="bg-gray-900 text-white hover:bg-emerald-600 px-6 rounded-full group-hover:shadow-lg transition-all">
                Đọc tiếp
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
