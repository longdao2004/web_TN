import React from 'react';
import { Order } from '@/types/order';

interface PaymentSummaryProps {
  order: Order;
}

export const PaymentSummary = ({ order }: PaymentSummaryProps) => {
  const subTotal = order.totalAmount + (order.discount || 0) - (order.shippingFee || 0);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm h-full animate-in slide-in-from-bottom-8 duration-700 fade-in delay-150 fill-mode-both">
      <h2 className="text-lg font-bold text-gray-900 mb-5">Thanh toán</h2>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Tạm tính</span>
          <span className="font-medium text-gray-900">{subTotal.toLocaleString('vi-VN')}đ</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">
            {order.shippingFee ? `${order.shippingFee.toLocaleString('vi-VN')}đ` : 'Miễn phí'}
          </span>
        </div>

        {order.discount !== undefined && order.discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Giảm giá</span>
            <span className="font-medium text-emerald-600">- {order.discount.toLocaleString('vi-VN')}đ</span>
          </div>
        )}
        
        <div className="w-full h-px bg-gray-100 my-2"></div>
        
        <div className="flex justify-between items-center">
          <span className="font-bold text-gray-900">Tổng cộng</span>
          <div className="text-right">
            <span className="text-xl font-black text-emerald-600 block">
              {order.totalAmount.toLocaleString('vi-VN')}đ
            </span>
            <span className="text-xs text-gray-400 font-medium">Đã bao gồm VAT (nếu có)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
