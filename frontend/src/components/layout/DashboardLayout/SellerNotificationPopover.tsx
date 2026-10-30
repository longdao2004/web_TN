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
} from "lucide-react";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";

// Hàm phân loại nội dung thông báo theo vai trò và trạng thái đơn
const getNotificationInfo = (order: any, isAdmin: boolean) => {
  const shortId = order.id ? order.id.slice(0, 8).toUpperCase() : "";
  const customerName = order.user?.fullName || "Khách hàng";
  const storeName = order.items?.[0]?.product?.store?.name || order.store?.name || "Gian hàng";

  switch (order.status) {
    case "PENDING":
      return {
        title: `Đơn hàng mới #${shortId}`,
        desc: isAdmin 
          ? `${customerName} vừa đặt đơn COD tại ${storeName}.`
          : `${customerName} vừa đặt đơn COD. Vui lòng xác nhận & đóng gói.`,
        icon: Clock,
        iconColor: "text-amber-500",
        iconBg: "bg-amber-50",
      };
    case "PACKING":
      return {
        title: `Đơn đã thanh toán #${shortId}`,
        desc: isAdmin
          ? `${customerName} đã thanh toán VNPay tại ${storeName}.`
          : `${customerName} đã thanh toán VNPay. Vui lòng đóng gói và giao hàng.`,
        icon: Package,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-50",
      };
    case "SHIPPING":
      return {
        title: `Đơn đang giao #${shortId}`,
        desc: `Đơn #${shortId} đang trên đường giao tới ${customerName}.`,
        icon: Truck,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-50",
      };
    case "COMPLETED":
      return {
        title: `Đơn hoàn tất #${shortId}`,
        desc: `Đã giao hàng thành công cho ${customerName}.`,
        icon: CheckCircle2,
        iconColor: "text-emerald-500",
        iconBg: "bg-emerald-50",
      };
    case "CANCELLED":
      return {
        title: `Đơn đã hủy #${shortId}`,
        desc: `Đơn hàng #${shortId} đã bị hủy.`,
        icon: XCircle,
        iconColor: "text-rose-500",
        iconBg: "bg-rose-50",
      };
    default:
      return {
        title: `Đơn hàng #${shortId}`,
        desc: "Có cập nhật mới về đơn hàng.",
        icon: Package,
        iconColor: "text-gray-500",
        iconBg: "bg-gray-50",
      };
  }
};

export const SellerNotificationPopover = () => {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const ordersUrl = isAdmin ? "/admin/orders" : "/seller/orders";

  const [isOpen, setIsOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Đóng popover khi click ra ngoài
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

  // Tải danh sách đơn hàng
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await orderService.getStoreOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [isOpen]);

  // Đếm số đơn cần chú ý (PENDING hoặc PACKING)
  const pendingCount = orders.filter(
    (o) => o.status === "PENDING" || o.status === "PACKING"
  ).length;

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Nút quả chuông */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors focus:outline-none"
        title={isAdmin ? "Thông báo sàn" : "Thông báo đơn hàng"}
      >
        <Bell className="h-5 w-5" />
        {pendingCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
            {pendingCount > 9 ? "9+" : pendingCount}
          </span>
        )}
      </button>

      {/* Popover danh sách thông báo */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-gray-900 text-sm">
                {isAdmin ? "Thông báo đơn toàn sàn" : "Thông báo đơn hàng"}
              </span>
              {pendingCount > 0 && (
                <span className="bg-amber-100 text-amber-700 text-[11px] px-2 py-0.5 rounded-full font-semibold">
                  {pendingCount} {isAdmin ? "đơn mới" : "cần xử lý"}
                </span>
              )}
            </div>
            <Link
              href={ordersUrl}
              onClick={() => setIsOpen(false)}
              className="text-xs text-emerald-600 hover:underline font-medium"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="max-h-[360px] overflow-y-auto divide-y divide-gray-50">
            {isLoading ? (
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
                <p className="text-sm font-medium text-gray-700">Chưa có đơn hàng nào</p>
                <p className="text-xs text-gray-400 mt-1">
                  Khi phát sinh đơn hàng, thông báo sẽ hiển thị tại đây.
                </p>
              </div>
            ) : (
              orders.slice(0, 5).map((order) => {
                const info = getNotificationInfo(order, isAdmin);
                const IconComponent = info.icon;
                const totalAmount =
                  order.totalAmount ||
                  order.items?.reduce(
                    (sum: number, item: any) =>
                      sum + item.quantity * item.priceAtPurchase,
                    0
                  ) || 0;

                return (
                  <div
                    key={order.id}
                    onClick={() => {
                      setIsOpen(false);
                      router.push(ordersUrl);
                    }}
                    className="p-3.5 hover:bg-gray-50 cursor-pointer transition-colors flex items-start gap-3"
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
                          {new Date(order.createdAt).toLocaleTimeString("vi-VN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })} - {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                        <span>•</span>
                        <span className="font-semibold text-emerald-600">
                          {Number(totalAmount).toLocaleString("vi-VN")}đ
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="p-2 border-t border-gray-100 text-center bg-gray-50/50 rounded-b-2xl">
            <Link
              href={ordersUrl}
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-600 hover:text-emerald-600 font-medium inline-flex items-center gap-1 py-1"
            >
              {isAdmin ? "Vào trang Giám sát đơn hàng" : "Vào trang Quản lý đơn hàng"}
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};