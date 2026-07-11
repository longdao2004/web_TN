import React from 'react';
import Link from 'next/link';
import { PageContainer, Section } from '@/components/layout/core';
import { Button } from '@/components/ui';
import { ProductCard } from './components/ProductCard';
import { products } from '@/mock';

export const FeaturedProductsSection = () => {
  return (
    <Section bgClass="bg-white">
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Sản phẩm nổi bật</h2>
            <p className="mt-2 text-sm text-gray-500">Được khách hàng đánh giá cao nhất trong tuần</p>
          </div>
          <Link href="/san-pham">
            <Button variant="outline">Xem tất cả</Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
