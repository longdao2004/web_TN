import React from 'react';
import Link from 'next/link';
import { PageContainer, Section } from '@/components/layout/core';
import { news } from '@/mock';
import { Button } from '@/components/ui';

export const NewsSection = () => {
  return (
    <Section bgClass="bg-gray-50">
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Góc kiến thức</h2>
            <p className="mt-2 text-sm text-gray-500">Tin tức nông nghiệp và mẹo vặt nhà bếp</p>
          </div>
          <Link href="/blog">
            <Button variant="outline">Xem tất cả bài viết</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {news.map((item) => (
            <Link key={item.id} href={`/blog/${item.id}`} className="group flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 transition-all hover:shadow-lg">
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
                />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                  <span>{item.author}</span>
                  <span>{item.date}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">
                  {item.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
