import React from 'react';
import Link from 'next/link';
import { OrderProduct } from '@/types/order';
import { ShoppingBag } from 'lucide-react';

interface PurchasedProductsProps {
  products: OrderProduct[];
}

export const PurchasedProducts = ({ products }: PurchasedProductsProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-6 duration-700 fade-in delay-75 fill-mode-both">
      <div className="flex items-center gap-2 mb-5">
        <ShoppingBag className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Sản phẩm</h2>
      </div>
      
      <div className="flex flex-col gap-4">
        {products.map((product) => (
          <Link key={product.id} href={`/san-pham/${product.id}`} className="group block">
            <div className="flex gap-4 items-center p-3 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-200">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              
              <div className="flex-1 flex flex-col justify-center min-w-0 py-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {product.name}
                </h3>
                <div className="flex justify-between items-end mt-auto pt-2">
                  <div className="text-gray-500 text-sm">
                    {product.price.toLocaleString('vi-VN')}đ <span className="text-gray-400 mx-1">x</span> <span className="font-medium text-gray-700">{product.quantity}</span>
                  </div>
                  <div className="font-bold text-emerald-600">
                    {(product.price * product.quantity).toLocaleString('vi-VN')}đ
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
