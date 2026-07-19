import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export const OrderSuccessHero = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-6 sm:py-10 animate-in zoom-in-95 duration-500 fade-in">
      <div className="rounded-full bg-emerald-100 p-4 mb-6">
        <CheckCircle2 className="w-16 h-16 sm:w-20 sm:h-20 text-emerald-600" strokeWidth={2} />
      </div>
      <h1 className="text-2xl sm:text-4xl font-black text-gray-900 mb-3 tracking-tight">
        Đặt hàng thành công!
      </h1>
      <p className="text-gray-500 max-w-md mx-auto text-sm sm:text-base leading-relaxed">
        Cảm ơn bạn đã mua sắm tại AgriMarket. Đơn hàng của bạn đang được chúng tôi xác nhận và chuẩn bị giao.
      </p>
    </div>
  );
};
