import React from "react";
import {
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Star,
} from "lucide-react";
import { Store } from "@/types/store";

interface StoreStatisticsProps {
  statistics: Store;
}

export const StoreStatistics = ({ statistics }: StoreStatisticsProps) => {
  const stats = [
    {
      label: "Sản phẩm",
      value: statistics.totalProducts,
      icon: Package,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      label: "Đã bán",
      value: (statistics.totalSold / 1000).toFixed(1) + "k+",
      icon: ShoppingCart,
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      label: "Khách hàng",
      value: (statistics.totalCustomers / 1000).toFixed(1) + "k+",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      label: "Phản hồi",
      value: statistics.responseRate,
      icon: MessageSquare,
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
    {
      label: "Đánh giá",
      value: statistics.averageRating,
      icon: Star,
      color: "text-rose-500",
      bg: "bg-rose-50",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-4 duration-700 fade-in delay-100">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 divide-x divide-gray-50">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center text-center px-2 py-3"
          >
            <div
              className={`w-10 h-10 rounded-full ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-gray-900 mb-1">
              {stat.value}
            </span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
