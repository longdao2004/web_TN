"use client";
import React, { useState } from 'react';
import { Eye, X, MapPin, Phone, User, Package, CheckCircle, Truck, XCircle } from 'lucide-react';

// Dữ liệu giả được bổ sung thêm chi tiết món hàng và địa chỉ
const mockOrders = [
  {
    id: 'ORD-8A2B9C',
    date: '15/09/2026 14:30',
    customer: 'Đào Tất Long',
    phone: '0901234567',
    address: '123 Đường Xuân Thủy, Quận Cầu Giấy, TP. Hà Nội',
    total: 350000,
    status: 'Chờ xác nhận',
    paymentMethod: 'Thanh toán khi nhận hàng (COD)',
    items: [
      { name: 'Rau muống chuẩn VietGAP', qty: 2, price: 15000 },
      { name: 'Cam Canh Cao Phong', qty: 5, price: 64000 }
    ]
  },
  {
    id: 'ORD-1F3D5E',
    date: '14/09/2026 09:15',
    customer: 'Nguyễn Văn A',
    phone: '0912223334',
    address: '45 Lê Lợi, Phường Bến Nghé, Quận 1, TP. HCM',
    total: 120000,
    status: 'Đang giao',
    paymentMethod: 'Ví VNPay',
    items: [
      { name: 'Dâu tây Đà Lạt (Size L)', qty: 1, price: 120000 }
    ]
  }
];

export default function SellerOrdersPage() {
  // Trạng thái lưu trữ Đơn hàng đang được chọn để xem chi tiết
  // Nếu null nghĩa là đang đóng Popup
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
    <div className="p-6 relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <p className="text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng từ khách hàng</p>
      </div>

      <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-200 pb-4 overflow-x-auto">
        <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium shadow-sm">Tất cả đơn</button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Chờ xác nhận <span className="ml-1 bg-gray-200 px-2 py-0.5 rounded-full text-xs">1</span></button>
        <button className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg font-medium transition">Đang giao <span className="ml-1 bg-gray-200 px-2 py-0.5 rounded-full text-xs">1</span></button>
      </div>

      {/* BẢNG ĐƠN HÀNG */}
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
              <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                <td className="p-4 font-medium text-gray-800">{order.id}</td>
                <td className="p-4 text-gray-500">{order.date}</td>
                <td className="p-4 text-gray-800 font-medium">{order.customer}</td>
                <td className="p-4 font-bold text-emerald-600">{order.total.toLocaleString('vi-VN')}đ</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                </td>
                <td className="p-4 flex items-center justify-center">
                  <button 
                    onClick={() => setSelectedOrder(order)} // Mở Popup khi bấm nút này
                    className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition"
                  >
                    <Eye className="w-4 h-4" /> Chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-500 mt-1">Mã đơn: <span className="font-semibold text-[var(--color-primary)]">{selectedOrder.id}</span></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition p-2 bg-white rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body Modal (Có thanh cuộn nếu quá dài) */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Thông tin Giao hàng */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-600" /> Thông tin người nhận
                </h3>
                <p className="text-sm text-gray-700 flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> {selectedOrder.customer}</p>
                <p className="text-sm text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {selectedOrder.phone}</p>
                <p className="text-sm text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> {selectedOrder.address}</p>
              </div>

              {/* Danh sách Món hàng */}
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-emerald-600" /> Danh sách sản phẩm
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.qty}</p>
                      </div>
                      <p className="font-medium text-gray-800">{(item.qty * item.price).toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng kết tiền */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-gray-600">Phương thức thanh toán:</p>
                <p className="font-medium text-gray-800">{selectedOrder.paymentMethod}</p>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-lg font-bold text-gray-800">Tổng cộng:</p>
                <p className="text-2xl font-bold text-emerald-600">{selectedOrder.total.toLocaleString('vi-VN')}đ</p>
              </div>

            </div>

            {/* Footer Modal: Các nút thao tác */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              {selectedOrder.status === 'Chờ xác nhận' && (
                <>
                  <button className="px-5 py-2.5 flex items-center gap-2 bg-red-100 text-red-700 font-medium hover:bg-red-200 rounded-xl transition">
                    <XCircle className="w-5 h-5" /> Hủy đơn
                  </button>
                  <button className="px-5 py-2.5 flex items-center gap-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm">
                    <CheckCircle className="w-5 h-5" /> Xác nhận Duyệt đơn
                  </button>
                </>
              )}
              {selectedOrder.status === 'Đang giao' && (
                <button className="px-5 py-2.5 flex items-center gap-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl transition shadow-sm">
                  <Truck className="w-5 h-5" /> Đánh dấu Đã giao xong
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}