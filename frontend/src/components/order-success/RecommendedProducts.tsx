import React from 'react';
import { ProductCard } from '@/components/home/components/ProductCard';

interface RecommendedProductsProps {
  products: any[]; // Using any to match the ProductCard mock structure quickly
}

export const RecommendedProducts = ({ products }: RecommendedProductsProps) => {
  return (
    <div className="mt-16 sm:mt-24 mb-10 animate-in slide-in-from-bottom-12 duration-1000 fade-in delay-300 fill-mode-both">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center">
          Có thể bạn cũng thích
        </h2>
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
