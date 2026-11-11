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
  ShieldAlert,
  Bell,
} from "lucide-react";
import { orderService } from "@/services/order.service";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Bộ lọc tìm kiếm và trạng thái
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");

  // State Modal xem chi tiết & can thiệp đơn
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [cancelReason, setCancelReason] = useState(
    "Khách hàng gọi Hotline khiếu nại yêu cầu hủy đơn"
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [remindMessage, setRemindMessage] = useState(
    "Khách cần nhận gấp trong ngày, vui lòng ưu tiên đóng gói và bàn giao vận chuyển!"
  );
  const [isReminding, setIsReminding] = useState(false);

  // 1. Tải toàn bộ đơn hàng của sàn
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getStoreOrders();
      setOrders(Array.isArray(data) ? data : []);
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

  // 2. Thống kê KPI nhanh cho Admin
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === "COMPLETED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const inDeliveryCount = orders.filter(
    (o) => o.status === "PACKING" || o.status === "SHIPPING"
  ).length;
  const pendingCount = orders.filter((o) => o.status === "PENDING").length;

  // 3. Lọc danh sách đơn hàng theo từ khóa và trạng thái
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

  // 4. Xử lý Trọng tài can thiệp: HỦY ĐƠN KHẨN CẤP khi có khiếu nại / vi phạm
  const handleEmergencyCancel = async (orderId: string) => {
    if (
      !confirm(
        `XÁC NHẬN TRỌNG TÀI CAN THIỆP:\nBạn có chắc chắn muốn HỦY đơn hàng #${orderId
          .slice(0, 8)
          .toUpperCase()} với lý do:\n"${cancelReason}"?\n\nHệ thống sẽ tự động hoàn trả số lượng nông sản về kho của shop.`
      )
    ) {
      return;
    }

    try {
      setIsUpdating(true);
      await orderService.updateOrderStatus(orderId, "CANCELLED", cancelReason);
      alert("Đã can thiệp hủy đơn hàng thành công! Nông sản đã được hoàn về kho.");
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      alert("Lỗi can thiệp đơn: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // 4b. Admin gửi nhắc nhở thủ công thúc giục Shop giao hàng gấp
  const handleRemindShop = async (orderId: string) => {
    try {
      setIsReminding(true);
      await orderService.remindOrder(orderId, remindMessage);
      alert("Đã gửi thông báo nhắc nhở khẩn cấp tới Gian hàng!");
      setSelectedOrder(null);
      fetchOrders();
    } catch (error: any) {
      alert("Lỗi gửi nhắc nhở: " + error.message);
    } finally {
      setIsReminding(false);
    }
  };

  // 5. Huy hiệu trạng thái đơn hàng
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
            <Package className="w-3.5 h-3.5" /> Đang đóng gói
          </span>
        );
      case "SHIPPING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
            <Truck className="w-3.5 h-3.5" /> Đang giao hàng
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
        <p className="text-sm font-medium">Đang tải dữ liệu giám sát đơn hàng toàn sàn...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ TRANG */}
      <div>
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-gray-800">
            Giám sát Đơn hàng Toàn sàn
          </h1>
        </div>
        <p className="text-gray-500 text-sm mt-0.5">
          Theo dõi tiến độ giao dịch nông sản, giám sát chất lượng dịch vụ của chủ shop và trọng tài xử lý khiếu nại
        </p>
      </div>

      {/* THẺ THỐNG KÊ NHANH (KPIs) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Doanh số thực tế */}
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

        {/* Tổng số giao dịch */}
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

        {/* Đơn đang luân chuyển */}
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

        {/* Đơn chờ xử lý */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Đơn chờ xử lý
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingCount}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Shop chưa bấm xác nhận</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* THANH TÌM KIẾM & BỘ LỌC TRẠNG THÁI */}
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
            <option value="COMPLETED">Hoàn thành (COMPLETED)</option>
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
                <th className="p-4">Mã Đơn & Cảnh báo</th>
                <th className="p-4">Khách mua hàng</th>
                <th className="p-4">Gian hàng bán</th>
                <th className="p-4">Tổng tiền & Thanh toán</th>
                <th className="p-4">Ngày đặt</th>
                <th className="p-4 text-center">Trạng thái</th>
                <th className="p-4 text-center">Chi tiết</th>
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
                filteredOrders.map((order) => {
                  // Tính thời gian từ lúc tạo đơn (ms)
                  const orderAgeMs = Date.now() - new Date(order.createdAt).getTime();
                  const isPendingDelayed =
                    order.status === "PENDING" && orderAgeMs > 24 * 60 * 60 * 1000;
                  const isPackingDelayed =
                    order.status === "PACKING" && orderAgeMs > 48 * 60 * 60 * 1000;

                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition">
                      {/* Cột 1: Mã đơn & Cảnh báo chậm trễ (SLA) */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1 items-start">
                          <span className="font-mono text-xs font-bold text-gray-800 bg-gray-100 px-2.5 py-1 rounded-md">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </span>

                          {/* Cảnh báo: Shop chậm xác nhận quá 24h */}
                          {isPendingDelayed && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 animate-pulse"
                              title="Đơn hàng tạo quá 24h mà chủ shop chưa bấm xác nhận!"
                            >
                              <Clock className="w-3 h-3" /> Chậm xác nhận (&gt;24h)
                            </span>
                          )}

                          {/* Cảnh báo: Shop đóng gói quá 48h chưa gửi hàng */}
                          {isPackingDelayed && (
                            <span
                              className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1"
                              title="Đơn hàng đóng gói quá 48h chưa bàn giao cho shipper!"
                            >
                              <Package className="w-3 h-3" /> Chậm gửi hàng (&gt;48h)
                            </span>
                          )}

                          {/* Nhãn thủ công: Admin đã gửi nhắc nhở gấp */}
                          {order.adminRemind &&
                            (order.status === "PENDING" ||
                              order.status === "PACKING") && (
                              <span
                                className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1"
                                title={order.adminRemind}
                              >
                                <Bell className="w-3 h-3" /> Đã nhắc Shop
                              </span>
                            )}
                        </div>
                      </td>

                      {/* Cột 2: Khách mua hàng */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <p className="font-semibold text-gray-900">
                            {order.user?.fullName || "Khách mua"}
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

                      {/* Cột 4: Tổng tiền & Phương thức thanh toán */}
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

                      {/* Cột 7: Thao tác xem chi tiết */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setCancelReason("Khách hàng gọi Hotline khiếu nại yêu cầu hủy đơn");
                            setRemindMessage(
                              order.adminRemind ||
                                "Khách cần nhận gấp trong ngày, vui lòng ưu tiên đóng gói và bàn giao vận chuyển!"
                            );
                          }}
                          className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                          title="Xem chi tiết đơn hàng"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL XEM CHI TIẾT & TRỌNG TÀI CAN THIỆP ================= */}
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
              {/* Thông tin 2 chiều: Người mua & Chủ Shop (Kèm nút bấm gọi điện trực tiếp) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Khối Người nhận hàng */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <User className="w-4 h-4 text-emerald-600" /> Người nhận hàng
                    </p>
                    {(selectedOrder.phone || selectedOrder.user?.phone) && (
                      <a
                        href={`tel:${selectedOrder.phone || selectedOrder.user?.phone}`}
                        className="px-2 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold flex items-center gap-1 transition"
                        title="Bấm để gọi điện cho khách hàng"
                      >
                        <Phone className="w-3 h-3" /> Gọi khách
                      </a>
                    )}
                  </div>
                  <p className="text-gray-900 font-semibold">
                    {selectedOrder.user?.fullName || "Khách mua"}
                  </p>
                  <p className="flex items-center gap-1 text-gray-600">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {selectedOrder.phone || selectedOrder.user?.phone || "Chưa có SĐT"}
                  </p>
                  <p className="flex items-start gap-1 text-gray-600">
                    <MapPin className="w-3.5 h-3.5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{selectedOrder.shippingAddress || "Chưa cập nhật địa chỉ"}</span>
                  </p>
                </div>

                {/* Khối Gian hàng phụ trách */}
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-gray-800 text-sm flex items-center gap-1.5">
                      <Store className="w-4 h-4 text-blue-600" /> Gian hàng phụ trách
                    </p>
                    {selectedOrder.store?.phone && (
                      <a
                        href={`tel:${selectedOrder.store.phone}`}
                        className="px-2 py-1 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1 transition"
                        title="Bấm để gọi điện cho chủ gian hàng"
                      >
                        <Phone className="w-3 h-3" /> Gọi chủ shop
                      </a>
                    )}
                  </div>
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

              {/* ============================================================== */}
              {/* KHU VỰC CAN THIỆP THỰC TIỄN (KHÓA ĐƠN ĐÓNG BĂNG & CHỈ CAN THIỆP HỦY) */}
              {/* ============================================================== */}

              {/* Trường hợp 1: Đơn đã HOÀN THÀNH -> KHÓA CỨNG (Terminal State) */}
              {selectedOrder.status === "COMPLETED" && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-bold text-emerald-900 text-xs">
                      Đơn hàng đã hoàn thành và đối soát
                    </p>
                    <p className="text-emerald-700 text-[11px] mt-0.5 leading-relaxed">
                      Đơn hàng đã kết thúc vòng đời. Dữ liệu kế toán và thanh toán đã được đóng băng vĩnh viễn, không ai được phép sửa đổi.
                    </p>
                  </div>
                </div>
              )}

              {/* Trường hợp 2: Đơn đã HỦY BỎ -> KHÓA CỨNG (Terminal State) */}
              {selectedOrder.status === "CANCELLED" && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-3">
                  <XCircle className="w-5 h-5 text-rose-600 shrink-0" />
                  <div>
                    <p className="font-bold text-rose-900 text-xs">
                      Đơn hàng đã bị hủy bỏ
                    </p>
                    <p className="text-rose-700 text-[11px] mt-0.5 leading-relaxed">
                      Toàn bộ nông sản trong đơn đã được hệ thống tự động hoàn lại vào kho của shop. Đơn hàng đã đóng băng và không thể khôi phục lại.
                    </p>
                    {selectedOrder.cancelReason && (
                      <p className="text-rose-800 text-xs font-semibold mt-1.5">
                        Lý do: {selectedOrder.cancelReason}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Trường hợp 2b: Đơn CHỜ XÁC NHẬN hoặc ĐANG ĐÓNG GÓI -> Cho phép Admin gửi nhắc nhở thủ công tới Shop */}
              {(selectedOrder.status === "PENDING" ||
                selectedOrder.status === "PACKING") && (
                <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-blue-900 font-bold text-xs">
                      <Bell className="w-4 h-4 text-blue-600" />
                      Nhắc nhở Gian hàng Xử lý Gấp (Thủ công)
                    </div>
                    {selectedOrder.adminRemind && (
                      <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-200 text-blue-800 rounded">
                        Đã gửi nhắc nhở
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Gửi thông báo thúc giục trực tiếp lên chuông thông báo và danh sách đơn của Chủ shop trước khi cần can thiệp hủy đơn.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <input
                      type="text"
                      value={remindMessage}
                      onChange={(e) => setRemindMessage(e.target.value)}
                      placeholder="Nhập lời nhắc gửi tới Gian hàng..."
                      className="flex-1 px-3 py-2 text-xs bg-white border border-blue-300 rounded-xl outline-none text-gray-800 font-medium focus:border-blue-500"
                    />
                    <button
                      disabled={isReminding}
                      onClick={() => handleRemindShop(selectedOrder.id)}
                      className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
                    >
                      <Bell className="w-4 h-4" />
                      {isReminding
                        ? "Đang gửi..."
                        : selectedOrder.adminRemind
                          ? "Gửi lại nhắc nhở"
                          : "Gửi nhắc nhở Shop"}
                    </button>
                  </div>
                </div>
              )}

              {/* Trường hợp 3: Đơn ĐANG XỬ LÝ (PENDING, PACKING, SHIPPING) -> Cho phép Trọng tài can thiệp HỦY */}
              {selectedOrder.status !== "COMPLETED" && selectedOrder.status !== "CANCELLED" && (
                <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                      <ShieldAlert className="w-4 h-4 text-amber-600" />
                      Quyền Trọng tài Quản trị viên: Hủy đơn do khiếu nại / vi phạm
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-amber-200 text-amber-800 rounded">
                      Đơn đang trong tiến trình
                    </span>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Chỉ sử dụng quyền này khi phát sinh khiếu nại qua Hotline, chủ shop quá hạn không xử lý, hoặc phát hiện đơn hàng ảo. Khi bấm hủy, hệ thống sẽ tự động hoàn nông sản về kho.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <select
                      value={cancelReason}
                      onChange={(e) => setCancelReason(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl outline-none text-gray-800 font-medium"
                    >
                      <option value="Khách hàng gọi Hotline khiếu nại yêu cầu hủy đơn">
                        Khách hàng gọi Hotline khiếu nại yêu cầu hủy đơn
                      </option>
                      <option value="Chủ shop quá hạn 24h không xác nhận và đóng gói">
                        Chủ shop quá hạn không xác nhận / đóng gói
                      </option>
                      <option value="Nghi ngờ đơn hàng ảo / gian lận thông tin">
                        Nghi ngờ đơn hàng ảo / gian lận
                      </option>
                      <option value="Hai bên thỏa thuận hủy đơn do nông sản bị dập hỏng">
                        Hai bên thỏa thuận hủy đơn (hàng dập/hỏng)
                      </option>
                    </select>

                    <button
                      disabled={isUpdating}
                      onClick={() => handleEmergencyCancel(selectedOrder.id)}
                      className="px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl transition shadow-sm flex items-center justify-center gap-1.5 disabled:opacity-50 shrink-0"
                    >
                      <XCircle className="w-4 h-4" />
                      {isUpdating ? "Đang hủy..." : "Xác nhận Hủy Đơn"}
                    </button>
                  </div>
                </div>
              )}
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