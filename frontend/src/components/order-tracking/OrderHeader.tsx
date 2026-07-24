import React from 'react';
import { Order } from '@/types/order';
import { Package, Calendar, Banknote } from 'lucide-react';

interface OrderHeaderProps {
  order: Order;
}

export const OrderHeader = ({ order }: OrderHeaderProps) => {
  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-500 fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-50 pb-4 mb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-emerald-600" />
            Chi tiết đơn hàng
          </h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            Mã đơn: <span className="font-semibold text-gray-900">{order.code}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-amber-100 text-amber-700 font-semibold rounded-full text-sm">
            {order.status}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1.5 uppercase font-medium tracking-wider">
            <Calendar className="w-3.5 h-3.5" /> Ngày đặt
          </span>
          <span className="font-medium text-gray-900">{order.createdAt}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 flex items-center gap-1.5 uppercase font-medium tracking-wider">
            <Banknote className="w-3.5 h-3.5" /> Thanh toán
          </span>
          <span className="font-medium text-gray-900">{order.paymentMethod}</span>
        </div>
        
        <div className="flex flex-col gap-1">
          <span className="text-xs text-gray-500 uppercase font-medium tracking-wider">
            Tổng tiền
          </span>
          <span className="text-lg font-bold text-emerald-600">
            {order.totalAmount.toLocaleString('vi-VN')}đ
          </span>
        </div>
      </div>
    </div>
  );
};
