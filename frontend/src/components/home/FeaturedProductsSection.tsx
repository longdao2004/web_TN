"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { PageContainer, Section } from '@/components/layout/core';
import { Button } from '@/components/ui';
import { ProductCard } from './components/ProductCard';
import { productService } from '@/services/product.service';

export const FeaturedProductsSection = () => {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productService.getProducts().then(setProducts).catch(console.error);
  }, []);

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
          {products.slice(0, 8).map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index < 4} />
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
