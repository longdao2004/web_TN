import React from 'react';
import Link from 'next/link';
import { PageContainer, Section } from '@/components/layout/core';
import { Button } from '@/components/ui';
import { ProductCard } from './components/ProductCard';
import { products } from '@/mock';

export const NewProductsSection = () => {
  // Lấy 4 sản phẩm cuối cùng làm ví dụ
  const newProducts = [...products].reverse().slice(0, 4);

  return (
    <Section bgClass="bg-gray-50">
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Sản phẩm mới lên kệ</h2>
            <p className="mt-2 text-sm text-gray-500">Nông sản vừa thu hoạch, tươi ngon 100%</p>
          </div>
          <Link href="/products?sort=newest">
            <Button variant="outline">Khám phá thêm</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:gap-6">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
