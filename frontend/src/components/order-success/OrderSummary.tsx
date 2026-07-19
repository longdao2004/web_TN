import React from 'react';
import { Order } from '@/types/order';

interface OrderSummaryProps {
  order: Order;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <h2 className="text-lg font-bold text-gray-900 mb-4">Thông tin đơn hàng</h2>
      
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 text-sm">Mã đơn hàng</span>
          <span className="font-semibold text-gray-900">{order.code}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 text-sm">Ngày đặt</span>
          <span className="font-medium text-gray-900">{order.createdAt}</span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 text-sm">Trạng thái</span>
          <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full">
            {order.status}
          </span>
        </div>
        
        <div className="flex justify-between items-center py-2 border-b border-gray-50">
          <span className="text-gray-500 text-sm">Tổng thanh toán</span>
          <span className="text-lg font-black text-emerald-600">
            {order.totalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>
        
        <div className="flex justify-between items-start py-2">
          <span className="text-gray-500 text-sm whitespace-nowrap mr-4">Phương thức</span>
          <span className="font-medium text-gray-900 text-right text-sm">
            {order.paymentMethod}
          </span>
        </div>
      </div>
    </div>
  );
};
