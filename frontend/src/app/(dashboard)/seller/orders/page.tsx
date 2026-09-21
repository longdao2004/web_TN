"use client";
import React, { useState, useEffect } from 'react';
import { Eye, X, MapPin, Phone, User, Package, CheckCircle, Truck, XCircle } from 'lucide-react';
import { orderService } from '@/services/order.service';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Hàm tải danh sách đơn hàng từ Backend
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getStoreOrders();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi lấy đơn hàng:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Hàm Cập nhật trạng thái đơn (Khi người bán bấm Duyệt / Giao / Hủy)
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      setIsUpdating(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      alert("Cập nhật trạng thái thành công!");
      setSelectedOrder(null); // Đóng popup
      fetchOrders(); // Tải lại danh sách đơn hàng cho mới
    } catch (error: any) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. Hàm dịch Trạng thái từ Database (Tiếng Anh) sang Tiếng Việt có màu
  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'PENDING': return { text: 'Chờ xác nhận', color: 'bg-amber-100 text-amber-700' };
      case 'PACKING': return { text: 'Đang đóng gói', color: 'bg-indigo-100 text-indigo-700' };
      case 'SHIPPING': return { text: 'Đang giao', color: 'bg-blue-100 text-blue-700' };
      case 'COMPLETED': return { text: 'Hoàn thành', color: 'bg-emerald-100 text-emerald-700' };
      case 'CANCELLED': return { text: 'Đã hủy', color: 'bg-red-100 text-red-700' };
      default: return { text: 'Chưa rõ', color: 'bg-gray-100 text-gray-700' };
    }
  };

  if (isLoading) return <div className="p-6">Đang tải danh sách đơn hàng...</div>;

  return (
    <div className="p-6 relative">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h1>
        <p className="text-gray-500 mt-1">Theo dõi và xử lý các đơn đặt hàng từ khách hàng</p>
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
            {orders.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-gray-500">Chưa có đơn hàng nào.</td></tr>
            ) : (
              orders.map((order) => {
                const statusObj = getStatusDisplay(order.status);
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition">
                    <td className="p-4 font-medium text-gray-800">{order.id.slice(0, 8).toUpperCase()}</td>
                    <td className="p-4 text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</td>
                    <td className="p-4 text-gray-800 font-medium">{order.user?.fullName || 'Khách Ẩn danh'}</td>
                    <td className="p-4 font-bold text-emerald-600">{order.totalAmount?.toLocaleString('vi-VN')}đ</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusObj.color}`}>
                        {statusObj.text}
                      </span>
                    </td>
                    <td className="p-4 flex items-center justify-center">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="text-gray-500 hover:bg-emerald-50 hover:text-emerald-600 px-3 py-1.5 rounded-lg flex items-center gap-2 text-sm font-medium transition"
                      >
                        <Eye className="w-4 h-4" /> Chi tiết
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL CHI TIẾT ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Chi tiết đơn hàng</h2>
                <p className="text-sm text-gray-500 mt-1">Mã đơn: <span className="font-semibold text-emerald-600">{selectedOrder.id}</span></p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-red-500 transition p-2 bg-white rounded-full shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {/* Thông tin Giao hàng */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-emerald-600" /> Thông tin người nhận
                </h3>
                <p className="text-sm text-gray-700 flex items-center gap-2"><User className="w-4 h-4 text-gray-400"/> {selectedOrder.user?.fullName}</p>
                <p className="text-sm text-gray-700 flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400"/> {selectedOrder.user?.phone}</p>
                <p className="text-sm text-gray-700 flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400"/> {selectedOrder.shippingAddress}</p>
              </div>

              {/* Danh sách Món hàng */}
              <div>
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-emerald-600" /> Danh sách sản phẩm
                </h3>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any, index: number) => (
                    <div key={index} className="flex justify-between items-center p-3 border border-gray-100 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-800">{item.product?.name || 'Sản phẩm'}</p>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                      </div>
                      <p className="font-medium text-gray-800">{(item.quantity * item.priceAtPurchase).toLocaleString('vi-VN')}đ</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tổng kết tiền */}
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-lg font-bold text-gray-800">Tổng thu:</p>
                <p className="text-2xl font-bold text-emerald-600">{selectedOrder.totalAmount?.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>

            {/* Footer Modal: Các nút thao tác */}
            <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
              {selectedOrder.status === 'PENDING' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'CANCELLED')}
                    disabled={isUpdating}
                    className="px-5 py-2.5 flex items-center gap-2 bg-red-100 text-red-700 font-medium hover:bg-red-200 rounded-xl transition disabled:opacity-50"
                  >
                    <XCircle className="w-5 h-5" /> Hủy đơn
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedOrder.id, 'SHIPPING')}
                    disabled={isUpdating}
                    className="px-5 py-2.5 flex items-center gap-2 bg-emerald-600 text-white font-medium hover:bg-emerald-700 rounded-xl transition shadow-sm disabled:opacity-50"
                  >
                    <Truck className="w-5 h-5" /> Giao hàng ngay
                  </button>
                </>
              )}
              {selectedOrder.status === 'SHIPPING' && (
                <button 
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'COMPLETED')}
                  disabled={isUpdating}
                  className="px-5 py-2.5 flex items-center gap-2 bg-blue-600 text-white font-medium hover:bg-blue-700 rounded-xl transition shadow-sm disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" /> Xác nhận Khách đã nhận
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}