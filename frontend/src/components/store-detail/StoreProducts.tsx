import React from 'react';
import { ProductCard } from '@/components/home/components/ProductCard';

interface StoreProductsProps {
  products: any[];
}

export const StoreProducts = ({ products }: StoreProductsProps) => {
  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in delay-400">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tất cả sản phẩm</h2>
        <span className="text-sm text-gray-500">{products.length} sản phẩm</span>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {/* Phân trang (Mock) */}
      <div className="flex justify-center mt-10">
        <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors">
          Xem thêm sản phẩm
        </button>
      </div>
    </div>
  );
};
