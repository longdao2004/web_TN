import React from 'react';
import Link from 'next/link';
import { ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui';

export const CallToAction = () => {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in zoom-in-95 duration-1000">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">Bắt đầu mua sắm ngay hôm nay</h2>
        <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
          Tham gia cùng hàng ngàn khách hàng khác để trải nghiệm không gian mua sắm nông sản tuyệt vời nhất.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link href="/san-pham" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-500/30 px-8 h-14 text-lg font-semibold rounded-full group">
              Khám phá sản phẩm
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          
          <Link href="/register" className="w-full sm:w-auto">
            <Button size="lg" variant="outline" className="w-full sm:w-auto border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 h-14 text-lg font-semibold rounded-full">
              Đăng ký tài khoản
              <UserPlus className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
