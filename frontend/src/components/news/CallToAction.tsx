import React from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBasket } from 'lucide-react';
import { Button } from '@/components/ui';

export const CallToAction = () => {
  return (
    <section className="py-20 bg-emerald-50 text-center border-t border-emerald-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-in zoom-in-95 duration-1000">
        <div className="inline-flex items-center justify-center p-4 bg-emerald-100 rounded-full mb-6 text-emerald-600">
          <ShoppingBasket className="w-8 h-8" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
          Khám phá các sản phẩm nông sản chất lượng
        </h2>
        <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
          Áp dụng ngay những kiến thức tuyệt vời vừa đọc để chọn cho gia đình những sản phẩm tươi ngon, an toàn và rõ ràng nguồn gốc trên hệ thống AgriMarket.
        </p>
        
        <Link href="/san-pham">
          <Button 
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 px-8 h-14 text-lg font-semibold rounded-full group"
          >
            Xem sản phẩm
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
