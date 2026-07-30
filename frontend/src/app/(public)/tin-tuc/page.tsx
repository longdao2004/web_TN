"use client";
import React, { useState, useMemo } from 'react';
import { PageContainer } from '@/components/layout/core';
import {
  NewsHero,
  FeaturedArticle,
  NewsCategories,
  NewsGrid,
  NewsSidebar,
  Newsletter,
  CallToAction
} from '@/components/news';
import { mockNews } from '@/mock/news';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState('Tất cả');

  // Filter bài viết dựa trên danh mục (Bỏ qua bài viết featured đầu tiên)
  const filteredNews = useMemo(() => {
    const list = mockNews.slice(1); // Bỏ qua bài đầu tiên vì đã nằm ở Featured
    
    if (activeCategory === 'Tất cả') {
      return list;
    }
    return list.filter(news => news.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <NewsHero />
      
      <div id="news-content" className="py-16">
        <PageContainer>
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
              Bài viết nổi bật
            </h2>
            <FeaturedArticle />
          </div>

          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main Content (Grid) */}
            <div className="lg:w-[70%]">
              <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  Mới cập nhật
                </h2>
                <NewsCategories 
                  activeCategory={activeCategory} 
                  onSelectCategory={setActiveCategory} 
                />
              </div>

              <NewsGrid articles={filteredNews} />
            </div>

            {/* Sidebar */}
            <div className="lg:w-[30%]">
              <div className="sticky top-24">
                <NewsSidebar />
              </div>
            </div>
          </div>
        </PageContainer>
      </div>

      <Newsletter />
      <CallToAction />
    </div>
  );
}
