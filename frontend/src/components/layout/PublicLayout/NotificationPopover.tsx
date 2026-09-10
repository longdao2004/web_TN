"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Package,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { orderService } from "@/services/order.service";

// Trợ thủ phân loại thông báo theo trạng thái đơn hàng
const getNotificationInfo = (order: any) => {
  const shortId = order.id.split("-")[0].toUpperCase();
  switch (order.status) {
    case "PENDING":
      return {
        title: `Đơn hàng #${shortId} đã được tạo`,
        desc: "Đang chờ nhà vườn xác nhận và chuẩn bị hàng.",
        icon: Clock,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
      };
    case "PACKING":
      return {
        title: `Đơn hàng #${shortId} đang đóng gói`,
        desc: "Nhà vườn đang kiểm tra độ tươi ngon và đóng gói.",
        icon: Package,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
      };
    case "SHIPPING":
      return {
        title: `Đơn hàng #${shortId} đang được giao`,
        desc: "Nông sản đang trên đường vận chuyển tới bạn.",
        icon: Truck,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-50",
      };
    case "COMPLETED":
    case "DELIVERED":
      return {
        title: `Đơn hàng #${shortId} giao thành công`,
        desc: "Cảm ơn bạn đã tin dùng nông sản sạch tại AgriMarket!",
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
      };
    case "CANCELLED":
      return {
        title: `Đơn hàng #${shortId} đã hủy`,
        desc: "Đơn hàng đã được hủy và tồn kho đã hoàn lại.",
        icon: XCircle,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50",
      };
    default:
      return {
        title: `Đơn hàng #${shortId}`,
        desc: "Có cập nhật mới về đơn hàng của bạn.",
        icon: Package,
        iconColor: "text-gray-500",
        iconBg: "bg-gray-50",
      };
  }
};

export const NotificationPopover = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Lắng nghe sự kiện click bên ngoài để đóng menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Lấy dữ liệu đơn hàng khi đăng nhập
  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await orderService.getOrderHistory();
        setOrders(Array.isArray(data) ? data : []);
      } catch {
        setOrders([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [isAuthenticated, isOpen]);

  // Số lượng đơn đang trong trạng thái chờ xử lý hoặc đang giao
  const activeOrdersCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PACKING" || o.status === "SHIPPING"
  ).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Nút bấm Quả chuông */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none"
        title="Thông báo"
      >
        <Bell className="h-5 w-5" />
        {isAuthenticated && activeOrdersCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {activeOrdersCount > 9 ? "9+" : activeOrdersCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {/* Tiêu đề Popover */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">Thông báo</span>
              {activeOrdersCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                  {activeOrdersCount} đơn đang xử lý
                </span>
              )}
            </div>
            {isAuthenticated && orders.length > 0 && (
              <Link
                href="/tai-khoan/don-hang"
                onClick={() => setIsOpen(false)}
                className="text-xs text-[var(--color-primary)] hover:underline font-medium"
              >
                Xem tất cả
              </Link>
            )}
          </div>

          {/* Danh sách thông báo */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {!isAuthenticated ? (
              <div className="p-6 text-center">
                <LogIn className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-800">Chưa đăng nhập</p>
                <p className="text-xs text-gray-500 mt-1 mb-4">
                  Đăng nhập để nhận thông báo về trạng thái đơn hàng của bạn.
                </p>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    router.push("/dang-nhap");
                  }}
                  className="bg-[var(--color-primary)] text-white text-xs font-semibold px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Đăng nhập ngay
                </button>
              </div>
            ) : isLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-9 h-9 bg-gray-100 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5 py-1">
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-2.5 bg-gray-100 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-700">Chưa có thông báo nào</p>
                <p className="text-xs text-gray-400 mt-1">
                  Các cập nhật về đơn hàng của bạn sẽ xuất hiện tại đây.
                </p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => {
                const info = getNotificationInfo(order);
                const IconComponent = info.icon;
                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(`/theo-doi-don-hang/${order.id}`);
                    }}
                    className="p-3.5 hover:bg-gray-50/80 cursor-pointer transition-colors flex items-start gap-3"
                  >
                    <div
                      className={`p-2 rounded-xl shrink-0 ${info.iconBg} ${info.iconColor}`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">
                        {info.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                        {info.desc}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-gray-400">
                        <span>
                          {new Intl.DateTimeFormat("vi-VN", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          }).format(new Date(order.createdAt))}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">
                          {order.totalAmount.toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Chân Popover */}
          {isAuthenticated && orders.length > 0 && (
            <div className="p-2 border-t border-gray-100 text-center bg-gray-50/50 rounded-b-2xl">
              <Link
                href="/tai-khoan/don-hang"
                onClick={() => setIsOpen(false)}
                className="text-xs text-gray-600 hover:text-[var(--color-primary)] font-medium inline-flex items-center gap-1 py-1"
              >
                Xem toàn bộ đơn mua
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};