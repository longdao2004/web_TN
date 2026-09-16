import React from 'react';
import { Eye } from 'lucide-react';

const mockOrders = [
  { id: 'ORD-8A2B9C', date: '15/09/2026 14:30', customer: 'Đào Tất Long', total: 350000, status: 'Chờ xác nhận', paymentMethod: 'COD' },
  { id: 'ORD-1F3D5E', date: '14/09/2026 09:15', customer: 'Nguyễn Văn A', total: 120000, status: 'Đang giao', paymentMethod: 'VNPay' },
  { id: 'ORD-9X7Y2Z', date: '12/09/2026 16:45', customer: 'Trần Thị Bích', total: 850000, status: 'Hoàn thành', paymentMethod: 'COD' }
];

export default function SellerOrdersPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Chờ xác nhận': return 'bg-amber-100 text-amber-700';
      case 'Đang giao': return 'bg-blue-100 text-blue-700';
      case 'Hoàn thành': return 'bg-emerald-100 text-emerald-700';
      case 'Đã hủy': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <p className="text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng từ khách hàng</p>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium whitespace-nowrap shadow-sm">Tất cả đơn</button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium whitespace-nowrap transition">Chờ xác nhận <span className="ml-1 bg-gray-200 px-2 py-0.5 rounded-full text-xs">1</span></button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium whitespace-nowrap transition">Đang giao <span className="ml-1 bg-gray-200 px-2 py-0.5 rounded-full text-xs">1</span></button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium whitespace-nowrap transition">Hoàn thành</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left whitespace-nowrap">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="p-4 font-semibold text-gray-600">Mã Đơn</th>
              <th className="p-4 font-semibold text-gray-600">Ngày đặt</th>
              <th className="p-4 font-semibold text-gray-600">Khách hàng</th>
              <th className="p-4 font-semibold text-gray-600">Tổng tiền</th>
              <th className="p-4 font-semibold text-gray-600">Trạng thái</th>
              <th className="p-4 font-semibold text-gray-600 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {mockOrders.map((order) => (
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4 font-medium text-gray-800">{order.id}</td>
                <td className="p-4 text-gray-500">{order.date}</td>
                <td className="p-4 text-gray-800 font-medium">{order.customer}</td>
                <td className="p-4 font-bold text-emerald-600">{order.total.toLocaleString('vi-VN')}đ</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="p-4 flex items-center justify-center">
                  <button className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition">
                    <Eye className="w-4 h-4" /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}