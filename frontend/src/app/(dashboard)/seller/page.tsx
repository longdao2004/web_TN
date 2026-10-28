"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  AlertTriangle,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { statisticService } from "@/services/statistic.service";

export default function SellerDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const res = await statisticService.getOverview();
        setData(res);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[400px] text-gray-500">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm font-medium">Đang tổng hợp số liệu kinh doanh...</p>
      </div>
    );
  }

  const {
    totalRevenue = 0,
    totalOrders = 0,
    pendingOrders = 0,
    expiringBatchesCount = 0,
    orderStatusFunnel = { pending: 0, packing: 0, shipping: 0, completed: 0, cancelled: 0 },
    alerts = { expiringSoon: [], lowStock: [] },
    revenueChart7Days = [],
  } = data || {};

  // Tìm giá trị doanh thu cao nhất trong 7 ngày để tính chiều cao cột (%)
  const maxDayRevenue = Math.max(
    ...revenueChart7Days.map((d: any) => d.revenue),
    1
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* TIÊU ĐỀ DASHBOARD */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Tổng quan Cửa hàng
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Theo dõi doanh thu, tiến độ đơn hàng và cảnh báo tồn kho nông sản
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 self-start sm:self-auto">
          <Calendar className="w-4 h-4" />
          Hôm nay: {new Date().toLocaleDateString("vi-VN")}
        </div>
      </div>

      {/* ============================================================== */}
      {/* HÀNG 1: 4 THẺ KPI CHÍNH */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Doanh thu thực tế */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Doanh thu thực tế
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalRevenue.toLocaleString("vi-VN")}đ
            </p>
            <p className="text-xs text-gray-400 mt-1">Đơn hoàn thành</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2: Tổng đơn hàng */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Tổng đơn hàng
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {totalOrders}
            </p>
            <p className="text-xs text-gray-400 mt-1">Không tính đơn hủy</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3: Đơn chờ duyệt */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Đơn chờ duyệt
            </p>
            <p className="text-2xl font-bold text-amber-600 mt-1">
              {pendingOrders}
            </p>
            <Link
              href="/seller/orders"
              className="text-xs text-amber-600 hover:underline font-medium inline-flex items-center gap-1 mt-1"
            >
              Xử lý ngay <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4: Lô sắp hết hạn */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Lô sắp hết hạn
            </p>
            <p className="text-2xl font-bold text-rose-600 mt-1">
              {expiringBatchesCount}
            </p>
            <Link
              href="/seller/batches"
              className="text-xs text-rose-600 hover:underline font-medium inline-flex items-center gap-1 mt-1"
            >
              Cần xả hàng <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HÀNG 2: VẬN HÀNH & CẢNH BÁO (2 CỘT) */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CỘT TRÁI: TIẾN ĐỘ ĐƠN HÀNG (FULFILLMENT FUNNEL) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">
              Tiến độ Xử lý Đơn hàng
            </h2>
            <Link
              href="/seller/orders"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {/* Chờ xác nhận */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50/60 border border-amber-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium text-gray-700">
                  Chờ xác nhận
                </span>
              </div>
              <span className="text-base font-bold text-amber-700">
                {orderStatusFunnel.pending} đơn
              </span>
            </div>

            {/* Đang đóng gói */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-indigo-50/60 border border-indigo-100">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-indigo-600" />
                <span className="text-sm font-medium text-gray-700">
                  Đang đóng gói
                </span>
              </div>
              <span className="text-base font-bold text-indigo-700">
                {orderStatusFunnel.packing} đơn
              </span>
            </div>

            {/* Đang giao hàng */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/60 border border-blue-100">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">
                  Đang giao hàng
                </span>
              </div>
              <span className="text-base font-bold text-blue-700">
                {orderStatusFunnel.shipping} đơn
              </span>
            </div>

            {/* Hoàn thành */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium text-gray-700">
                  Giao thành công
                </span>
              </div>
              <span className="text-base font-bold text-emerald-700">
                {orderStatusFunnel.completed} đơn
              </span>
            </div>

            {/* Đã hủy */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200/70">
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-600">
                  Đã hủy
                </span>
              </div>
              <span className="text-base font-bold text-gray-600">
                {orderStatusFunnel.cancelled} đơn
              </span>
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: CẢNH BÁO LÔ HÀNG & TỒN KHO NÔNG SẢN */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-gray-800">
              Cảnh báo Kho Nông sản
            </h2>
            <Link
              href="/seller/batches"
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              Quản lý Lô <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[300px]">
            {alerts.expiringSoon.length === 0 && alerts.lowStock.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center py-8 text-center text-gray-400">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Kho hàng đang rất an toàn!
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  Không có lô hàng nào cận date hoặc sắp hết tồn kho.
                </p>
              </div>
            ) : (
              <>
                {/* Danh sách Lô cận date */}
                {alerts.expiringSoon.map((item: any, idx: number) => (
                  <div
                    key={`exp-${idx}`}
                    className="p-3 bg-rose-50/70 border border-rose-100 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-rose-600 mt-0.5">
                        ⏳ Còn {item.daysLeft} ngày là hết hạn (HSD:{" "}
                        {new Date(item.expiryDate).toLocaleDateString("vi-VN")})
                      </p>
                    </div>
                    <span className="text-xs font-bold text-rose-700 bg-rose-100/80 px-2.5 py-1 rounded-md">
                      Tồn: {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}

                {/* Danh sách Lô sắp hết hàng */}
                {alerts.lowStock.map((item: any, idx: number) => (
                  <div
                    key={`low-${idx}`}
                    className="p-3 bg-amber-50/70 border border-amber-100 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-900">
                        {item.productName}
                      </p>
                      <p className="text-xs text-amber-700 mt-0.5">
                        📦 Sắp hết hàng — Cần nhập đợt mới gối vụ
                      </p>
                    </div>
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-md">
                      Còn: {item.quantity} {item.unit}
                    </span>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* HÀNG 3: BIỂU ĐỒ DOANH THU 7 NGÀY GẦN NHẤT (FULL-WIDTH) */}
      {/* ============================================================== */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-gray-800">
                Biểu đồ Doanh thu (7 Ngày qua)
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Doanh thu thực tế theo từng ngày của các đơn hàng đã hoàn tất
            </p>
          </div>
          <div className="text-xs text-gray-500 font-medium">
            Cao nhất tuần:{" "}
            <span className="font-bold text-emerald-600">
              {maxDayRevenue > 1 ? maxDayRevenue.toLocaleString("vi-VN") + "đ" : "0đ"}
            </span>
          </div>
        </div>

        {/* VÙNG VẼ BIỂU ĐỒ CỘT */}
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
                  {/* Tooltip khi rê chuột vào cột */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-semibold py-1 px-2.5 rounded-lg pointer-events-none whitespace-nowrap shadow-lg z-10">
                    <p>{item.date} ({item.dayName}): {item.revenue.toLocaleString("vi-VN")}đ</p>
                    <p className="text-[10px] text-gray-300 font-normal">
                      {item.ordersCount} đơn thành công
                    </p>
                  </div>

                  {/* Nhãn doanh thu trên đầu cột (nếu có tiền) */}
                  {item.revenue > 0 && (
                    <span className="text-[10px] font-bold text-emerald-600 mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                      {(item.revenue / 1000).toFixed(0)}k
                    </span>
                  )}

                  {/* Thanh cột doanh thu */}
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full max-w-[48px] rounded-t-xl transition-all duration-300 ${
                      item.revenue > 0
                        ? "bg-gradient-to-t from-emerald-600 to-emerald-400 group-hover:from-emerald-700 group-hover:to-emerald-500 shadow-sm"
                        : "bg-gray-100"
                    }`}
                  ></div>
                </div>
              );
            })}
          </div>

          {/* TRỤC HOÀNH (TÊN NGÀY VÀ THỨ) */}
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
    </div>
  );
}