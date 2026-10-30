"use client";
import React, { useState, useEffect } from "react";
import {
  ShoppingBag,
  Search,
  Filter,
  Eye,
  X,
  MapPin,
  Phone,
  User,
  Store,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  CreditCard,
  Calendar,
  DollarSign,
  AlertTriangle,
} from "lucide-react";
import { orderService } from "@/services/order.service";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // State Modal xem chi tiết & can thiệp đơn
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // 1. Tải toàn bộ đơn hàng của sàn
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getStoreOrders();
      setOrders(data);
    } catch (error: any) {
      console.error("Lỗi tải đơn hàng toàn sàn:", error);
      alert("Lỗi tải đơn hàng: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 2. Thống kê KPI nhanh
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const inDeliveryCount = orders.filter(
    (o) => o.status === "PACKING" || o.status === "SHIPPING"
  ).length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  // 3. Lọc danh sách theo Search & Status
  const filteredOrders = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    const matchId = (order.id || "").toLowerCase().includes(term);
    const matchCustomer = (order.user?.fullName || "").toLowerCase().includes(term);
    const matchStore = (order.store?.name || "").toLowerCase().includes(term);
    const matchPhone = (order.phone || order.user?.phone || "").includes(term);

    const matchSearch = matchId || matchCustomer || matchStore || matchPhone;
    const matchStatus = selectedStatus === "ALL" || order.status === selectedStatus;

    return matchSearch && matchStatus;
  });

  // 4. Can thiệp cập nhật trạng thái đơn (Dành cho Admin khi có tranh chấp)
  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    if (
      !confirm(
        `Quản trị viên xác nhận can thiệp đổi trạng thái đơn sang "${getStatusText(newStatus)}"?`
      )
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      await orderService.updateOrderStatus(orderId, newStatus);
      alert("Đã cập nhật trạng thái đơn hàng thành công!");
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      alert("Lỗi can thiệp đơn: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Helper dịch trạng thái
  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xác nhận";
      case "PACKING":
        return "Đang đóng gói";
      case "SHIPPING":
        return "Đang giao hàng";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <Clock className="w-3.5 h-3.5" /> Chờ xác nhận
          </span>
        );
      case "PACKING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700">
            <Package className="w-3.5 h-3.5" /> Đóng gói
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Truck className="w-3.5 h-3.5" /> Đang giao
          </span>
        );
      case "COMPLETED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3.5 h-3.5" /> Hoàn thành
          </span>
        );
      case "CANCELLED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">
            <XCircle className="w-3.5 h-3.5" /> Đã hủy
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tải dữ liệu đơn hàng toàn sàn...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ */}
      <div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Giám sát Đơn hàng Toàn sàn
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-0.5">
          Theo dõi toàn bộ luồng giao dịch, đối soát phương thức thanh toán và hỗ trợ xử lý khiếu nại
        </p>
      </div>

      {/* THẺ THỐNG KÊ NHANH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Doanh số sàn thực tế
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalRevenue.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Từ các đơn hoàn thành</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng số giao dịch
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {totalOrdersCount}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Toàn bộ đơn phát sinh</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Đơn đang luân chuyển
            </p>
            <p className="text-2xl font-bold text-indigo-600 mt-1">
              {inDeliveryCount}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Đóng gói & Đang giao</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Đơn chờ xử lý
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingCount}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Shop chưa bấm duyệt</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo mã đơn, khách hàng, shop, SĐT..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-500 font-medium text-gray-700 transition"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xác nhận (PENDING)</option>
            <option value="PACKING">Đang đóng gói (PACKING)</option>
            <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
            <option value="COMPLETED">Giao thành công (COMPLETED)</option>
            <option value="CANCELLED">Đã hủy (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* BẢNG DANH SÁCH ĐƠN HÀNG TOÀN SÀN */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="p-4">Mã Đơn</th>
                <th className="p-4">Khách mua hàng</th>
                <th className="p-4">Gian hàng bán</th>
                <th className="p-4">Tổng tiền & Phương thức</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400">
                    Không tìm thấy đơn hàng nào phù hợp.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    {/* Cột 1: Mã đơn */}
                    <td className="p-4">
                      <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>

                    {/* Cột 2: Khách mua hàng */}
                    <td className="p-4">
                      <div className="space-y-0.5">
                        <p className="font-semibold text-gray-900">
                          {order.user?.fullName || "Khách vãng lai"}
                        </p>
                        <p className="text-xs text-gray-400">
                          {order.phone || order.user?.phone || "Chưa có SĐT"}
                        </p>
                      </div>
                    </td>

                    {/* Cột 3: Gian hàng bán */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={order.store?.logoUrl || "/images/products/cachuabi.avif"}
                          alt="Store"
                          className="w-7 h-7 rounded-lg object-cover border border-gray-100"
                        />
                        <span className="font-medium text-gray-800">
                          {order.store?.name || "Cửa hàng Nông sản"}
                        </span>
                      </div>
                    </td>

                    {/* Cột 4: Tổng tiền & Phương thức */}
                    <td className="p-4">
                      <p className="font-bold text-emerald-600">
                        {order.totalAmount?.toLocaleString("vi-VN")}đ
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-gray-500">
                        <CreditCard className="w-3 h-3" />
                        {order.payment?.provider === "VNPAY"
                          ? "VNPay Sandbox"
                          : "Thanh toán COD"}
                      </span>
                    </td>

                    {/* Cột 5: Ngày đặt */}
                    <td className="p-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString("vi-VN")
                            : "N/A"}
                        </span>
                      </div>
                    </td>

                    {/* Cột 6: Trạng thái */}
                    <td className="p-4 text-center">{getStatusBadge(order.status)}</td>

                    {/* Cột 7: Nút xem chi tiết */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                        title="Xem chi tiết đơn hàng"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL XEM CHI TIẾT & CAN THIỆP ĐƠN HÀNG ================= */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header Modal */}
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-gray-900">Chi tiết Đơn hàng</h2>
                  <span className="font-mono text-xs font-bold text-gray-600 bg-white px-2 py-0.5 rounded border border-gray-200">
                    #{selectedOrder.id.slice(0, 8).toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  Ngày đặt: {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-rose-500 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Thông tin Người mua & Gian hàng */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Thông tin giao hàng */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> Người nhận hàng
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {selectedOrder.user?.fullName || "Khách mua"}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedOrder.phone || selectedOrder.user?.phone || "Chưa có"}
                  </p>
                  <p className="flex items-start gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{selectedOrder.shippingAddress || "Chưa cập nhật địa chỉ"}</span>
                  </p>
                </div>

                {/* Thông tin gian hàng */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                    <Store className="w-4 h-4 text-blue-600" /> Gian hàng phụ trách
                  </p>
                  <p className="text-gray-900 font-semibold">
                    {selectedOrder.store?.name || "Cửa hàng Nông sản"}
                  </p>
                  <p className="text-gray-600">
                    Phương thức:{" "}
                    <strong>
                      {selectedOrder.payment?.provider === "VNPAY"
                        ? "VNPay Sandbox"
                        : "COD"}
                    </strong>
                  </p>
                  <p className="text-gray-600">
                    Tình trạng:{" "}
                    <span className="font-bold">
                      {selectedOrder.payment?.isSuccess
                        ? "Đã thanh toán (PAID)"
                        : "Chưa thanh toán"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Danh sách nông sản trong đơn */}
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Danh sách Nông sản ({selectedOrder.items?.length || 0} món)
                </p>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product?.imageUrl || "/images/products/cachuabi.avif"}
                          alt={item.product?.name}
                          className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-bold text-gray-900">{item.product?.name}</p>
                          <p className="text-gray-400">
                            Đơn giá: {item.priceAtPurchase?.toLocaleString("vi-VN")}đ
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">
                          SL: {item.quantity}
                        </p>
                        <p className="font-bold text-emerald-600">
                          {(item.quantity * item.priceAtPurchase).toLocaleString("vi-VN")}đ
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl mt-3 text-sm">
                  <span className="font-semibold text-gray-700">Tổng giá trị đơn hàng:</span>
                  <span className="font-extrabold text-emerald-700 text-base">
                    {selectedOrder.totalAmount?.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>

              {/* KHU VỰC CAN THIỆP CỦA ADMIN (XỬ LÝ KHIẾU NẠI) */}
              <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Quyền Quản trị viên: Can thiệp trạng thái đơn
                </div>
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  Sử dụng tính năng này khi có khiếu nại hoặc tranh chấp giữa người mua và người bán.
                  Hệ thống sẽ đồng bộ kho tự động nếu đơn chuyển sang trạng thái HỦY.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <select
                    defaultValue={selectedOrder.status}
                    id="adminStatusSelect"
                    className="px-3 py-1.5 text-xs font-semibold bg-white border border-amber-300 rounded-lg outline-none text-gray-800"
                  >
                    <option value="PENDING">Chờ xác nhận (PENDING)</option>
                    <option value="PACKING">Đang đóng gói (PACKING)</option>
                    <option value="SHIPPING">Đang giao hàng (SHIPPING)</option>
                    <option value="COMPLETED">Giao thành công (COMPLETED)</option>
                    <option value="CANCELLED">Hủy đơn hàng (CANCELLED)</option>
                  </select>

                  <button
                    disabled={isUpdating}
                    onClick={() => {
                      const selectEl = document.getElementById(
                        "adminStatusSelect"
                      ) as HTMLSelectElement;
                      if (selectEl) {
                        handleUpdateStatus(selectedOrder.id, selectEl.value);
                      }
                    }}
                    className="px-3.5 py-1.5 text-xs font-bold bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
                  >
                    {isUpdating ? "Đang xử lý..." : "Cập nhật trạng thái"}
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 flex justify-end bg-gray-50">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-200 rounded-xl transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}