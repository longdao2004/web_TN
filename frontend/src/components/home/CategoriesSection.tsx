import React from 'react';
import Link from 'next/link';
import { PageContainer, Section } from '@/components/layout/core';
import { categories } from '@/mock';

export const CategoriesSection = () => {
  return (
    <Section>
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Danh mục nổi bật</h2>
            <p className="mt-2 text-sm text-gray-500">Khám phá đa dạng các loại nông sản tươi ngon</p>
          </div>
          <Link href="/categories" className="text-sm font-medium text-[var(--color-primary)] hover:underline">
            Xem tất cả danh mục &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.slug}`}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 text-center transition-all hover:border-[var(--color-primary-light)] hover:shadow-md"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <img 
                  src={category.image} 
                  alt={category.name} 
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">{category.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{category.itemCount} sản phẩm</p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
