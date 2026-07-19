import React from 'react';
import { OrderProduct } from '@/types/order';
import Image from 'next/image';

interface PurchasedProductsProps {
  products: OrderProduct[];
}

export const PurchasedProducts = ({ products }: PurchasedProductsProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Sản phẩm đã mua</h2>
      
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <div key={product.id} className="flex gap-4 items-center">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 border border-gray-100">
              {/* Fallback to img since we don't have Next Image configured for external domains in this mock setup necessarily, but per requirements we try to avoid warnings if possible. We'll use a normal img to be safe with Unsplash mocks. */}
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 flex flex-col justify-center min-w-0">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
                {product.name}
              </h3>
              <div className="flex justify-between items-center mt-2">
                <div className="text-gray-500 text-sm">
                  {product.price.toLocaleString('vi-VN')}đ <span className="text-gray-400 mx-1">x</span> <span className="font-medium text-gray-700">{product.quantity}</span>
                </div>
                <div className="font-bold text-emerald-600">
                  {(product.price * product.quantity).toLocaleString('vi-VN')}đ
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
