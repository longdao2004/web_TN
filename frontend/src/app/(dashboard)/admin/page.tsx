"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  Clock,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  TrendingUp,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { statisticService } from "@/services/statistic.service";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        setIsLoading(true);
        const res = await statisticService.getAdminOverview();
        setData(res);
      } catch (error) {
        console.error("Lỗi tải thống kê admin:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAdminStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tổng hợp dữ liệu toàn sàn...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    totalUsers = 0,
    totalStores = 0,
    totalProducts = 0,
    userRoles = { customers: 0, sellers: 0, admins: 0 },
    orderStatusFunnel = { pending: 0, packing: 0, shipping: 0, completed: 0, cancelled: 0 },
    revenueChart7Days = [],
    recentOrders = [],
  } = data || {};

  const maxDayRevenue = Math.max(
    ...revenueChart7Days.map((d: any) => d.revenue),
    1
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PENDING":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Chờ duyệt</span>;
      case "PACKING":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-indigo-100 text-indigo-700">Đóng gói</span>;
      case "SHIPPING":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">Đang giao</span>;
      case "COMPLETED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Thành công</span>;
      case "CANCELLED":
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-rose-100 text-rose-700">Đã hủy</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Tổng quan Sàn Thương mại Nông sản
            </h1>
          </div>
          <p className="text-gray-500 text-sm mt-0.5">
            Bảng điều khiển trung tâm theo dõi hoạt động kinh doanh toàn sàn
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 self-start sm:self-auto">
          <Calendar className="w-4 h-4" />
          Hôm nay: {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* HÀNG 1: 4 THẺ KPI TOÀN SÀN */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Doanh thu toàn sàn
            </p>
            <p className="text-2xl font-bold text-emerald-600 mt-1">
              {totalRevenue.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-400 mt-1">Từ các đơn thành công</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng đơn toàn sàn
            </p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {totalOrders}
            </p>
            <p className="text-xs text-gray-400 mt-1">Giao dịch đã phát sinh</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng người dùng
            </p>
            <p className="text-2xl font-bold text-purple-600 mt-1">
              {totalUsers}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {userRoles.customers} khách • {userRoles.sellers} người bán
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Cửa hàng hoạt động
            </p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {totalStores}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Đang bán {totalProducts} sản phẩm
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Store className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* HÀNG 2: TIẾN ĐỘ ĐƠN HÀNG & CƠ CẤU THÀNH VIÊN (2 CỘT) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CỘT TRÁI: TIẾN ĐỘ ĐƠN TOÀN SÀN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Tình trạng Đơn hàng Toàn sàn
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">Đơn chờ xác nhận</span>
              </div>
              <span className="text-base font-bold text-amber-700">{orderStatusFunnel.pending} đơn</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">Đang đóng gói</span>
              </div>
              <span className="text-base font-bold text-indigo-700">{orderStatusFunnel.packing} đơn</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Đang giao hàng</span>
              </div>
              <span className="text-base font-bold text-blue-700">{orderStatusFunnel.shipping} đơn</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">Giao thành công</span>
              </div>
              <span className="text-base font-bold text-emerald-700">{orderStatusFunnel.completed} đơn</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/70">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">Đã hủy</span>
              </div>
              <span className="text-base font-bold text-gray-600">{orderStatusFunnel.cancelled} đơn</span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CƠ CẤU THÀNH VIÊN VÀ HỆ SINH THÁI */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <h2 className="text-base font-bold text-gray-800 mb-4">
            Quy mô Hệ sinh thái Nông sản
          </h2>
          <div className="space-y-3">
            <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Khách mua hàng (Customers)</p>
                <p className="text-xs text-purple-600 mt-0.5">Tài khoản người tiêu dùng</p>
              </div>
              <span className="text-xl font-bold text-purple-700">{userRoles.customers}</span>
            </div>
            <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Đối tác Bán hàng (Sellers)</p>
                <p className="text-xs text-orange-600 mt-0.5">Nông hộ / Hợp tác xã đăng ký gian hàng</p>
              </div>
              <span className="text-xl font-bold text-orange-700">{userRoles.sellers}</span>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Gian hàng Nông sản hoạt động</p>
                <p className="text-xs text-emerald-600 mt-0.5">Đã đăng ký cửa hàng kinh doanh</p>
              </div>
              <span className="text-xl font-bold text-emerald-700">{totalStores}</span>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-800">Sản phẩm nông sản trên sàn</p>
                <p className="text-xs text-blue-600 mt-0.5">Đang niêm yết bán buôn & bán lẻ</p>
              </div>
              <span className="text-xl font-bold text-blue-700">{totalProducts}</span>
            </div>
          </div>
        </div>
      </div>

      {/* HÀNG 3: BIỂU ĐỒ DOANH THU TOÀN SÀN 7 NGÀY GẦN NHẤT */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Doanh thu Toàn sàn (7 Ngày qua)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Tổng giá trị giao dịch thành công của toàn bộ cửa hàng trên sàn
            </p>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Ngày cao nhất:{" "}
            <span className="font-bold text-emerald-600">
              {maxDayRevenue > 1 ? maxDayRevenue.toLocaleString("vi-VN") + "đ" : "0đ"}
            </span>
          </div>
        </div>

        <div className="pt-6 pb-2">
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 border-b border-gray-100 pb-2">
            {revenueChart7Days.map((item: any, idx: number) => {
              const heightPercent =
                maxDayRevenue > 1 && item.revenue > 0
                  ? Math.max(Math.round((item.revenue / maxDayRevenue) * 100), 8)
                  : 4;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center group relative h-full justify-end"
                >
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-10">
                    <p>{item.date} ({item.dayName}): {item.revenue.toLocaleString("vi-VN")}đ</p>
                    <p className="text-[10px] text-gray-300 font-normal">
                      {item.ordersCount} đơn hoàn thành
                    </p>
                  </div>

                  {item.revenue > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      {(item.revenue / 1000).toFixed(0)}k
                    </span>
                  )}

                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                      item.revenue > 0
                        ? "bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-700 group-hover:to-teal-500 shadow-sm"
                        : "bg-gray-100"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 sm:gap-6 pt-3">
            {revenueChart7Days.map((item: any, idx: number) => (
              <div key={idx} className="flex-1 text-center">
                <p className="text-xs font-bold text-gray-700">{item.dayName}</p>
                <p className="text-[10px] text-gray-400">{item.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HÀNG 4: 5 ĐƠN HÀNG MỚI NHẤT TRÊN TOÀN SÀN */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-base font-bold text-gray-800 mb-4">
          Giao dịch Mới nhất trên Toàn sàn
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left whitespace-nowrap">
            <thead className="bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase">
              <tr>
                <th className="p-3.5">Mã Đơn</th>
                <th className="p-3.5">Khách hàng</th>
                <th className="p-3.5">Cửa hàng bán</th>
                <th className="p-3.5">Tổng tiền</th>
                <th className="p-3.5">Thời gian</th>
                <th className="p-3.5 text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-gray-400">
                    Chưa có giao dịch nào trên hệ thống.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition">
                    <td className="p-3.5 font-mono text-xs text-gray-600 font-medium">
                      {order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="p-3.5 font-medium text-gray-900">
                      {order.customerName}
                    </td>
                    <td className="p-3.5 text-gray-600">
                      {order.storeName}
                    </td>
                    <td className="p-3.5 font-bold text-emerald-600">
                      {order.totalAmount.toLocaleString("vi-VN")}đ
                    </td>
                    <td className="p-3.5 text-gray-400 text-xs">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </td>
                    <td className="p-3.5 text-center">
                      {getStatusBadge(order.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}