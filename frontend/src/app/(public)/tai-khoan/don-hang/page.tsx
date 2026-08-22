"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Clock, CheckCircle2, XCircle, Truck, Eye } from "lucide-react";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import Image from "next/image";

type OrderItem = {
  productId: string;
  quantity: number;
  priceAtPurchase: number;
  product: {
    name: string;
    imageUrl: string;
  };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case "PENDING":
      return { label: "Chờ xác nhận", icon: Clock, color: "text-amber-500", bg: "bg-amber-50" };
    case "PACKING":
      return { label: "Đang đóng gói", icon: Package, color: "text-blue-500", bg: "bg-blue-50" };
    case "SHIPPING":
      return { label: "Đang giao hàng", icon: Truck, color: "text-indigo-500", bg: "bg-indigo-50" };
    case "DELIVERED":
      return { label: "Giao thành công", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-50" };
    case "CANCELLED":
      return { label: "Đã hủy", icon: XCircle, color: "text-red-500", bg: "bg-red-50" };
    default:
      return { label: "Khác", icon: Package, color: "text-gray-500", bg: "bg-gray-50" };
  }
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await orderService.getOrderHistory();
        setOrders(data);
      } catch (error: any) {
        toast.error(error.message || "Lỗi tải lịch sử đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (isLoading) {
    return <div className="text-center py-12">Đang tải lịch sử đơn hàng...</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-8 text-center">
        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Bạn chưa có đơn hàng nào</h2>
        <p className="text-gray-500 mb-6">Hãy dạo quanh và chọn mua những sản phẩm tươi ngon nhất nhé!</p>
        <Link
          href="/san-pham"
          className="inline-block bg-[var(--color-primary)] text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          Tiếp tục mua sắm
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đơn hàng của tôi</h1>
      
      {orders.map((order) => {
        const statusConfig = getStatusConfig(order.status);
        const StatusIcon = statusConfig.icon;
        
        return (
          <div key={order.id} className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)] flex flex-wrap gap-4 items-center justify-between bg-gray-50/50">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mã đơn hàng</p>
                <p className="font-semibold text-gray-900 text-sm">{order.id.split("-")[0].toUpperCase()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Ngày đặt</p>
                <p className="font-medium text-gray-900 text-sm">
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt))}
                </p>
              </div>
              <div className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 ${statusConfig.bg} ${statusConfig.color}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="text-sm font-medium">{statusConfig.label}</span>
              </div>
            </div>
            
            <div className="p-4 sm:p-6 flex flex-col gap-4">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{item.product.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">x{item.quantity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-medium text-gray-900">
                      {item.priceAtPurchase.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 border-t border-[var(--color-border)] flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Tổng tiền:</span>
                <span className="text-lg font-black text-emerald-600">
                  {order.totalAmount.toLocaleString("vi-VN")}đ
                </span>
              </div>
              <Link
                href={`/theo-doi-don-hang/${order.id}`}
                className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Eye className="w-4 h-4" />
                Xem chi tiết
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}
