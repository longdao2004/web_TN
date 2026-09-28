"use client";
import React, { useState, useEffect } from "react";
import { statisticService } from "@/services/statistic.service";

export default function SellerDashboardPage() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await statisticService.getOverview();
        setStats(data);
      } catch (error) {
        console.error("Lỗi tải thống kê:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) return <div className="p-6">Đang tải dữ liệu thống kê...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tổng quan Cửa hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Tổng đơn hàng</h3>
          <p className="text-3xl font-bold text-emerald-600 mt-2">
            {stats.totalOrders}
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Tổng doanh thu</h3>
          <p className="text-3xl font-bold text-blue-600 mt-2">
            {stats.totalRevenue.toLocaleString()}đ
          </p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 font-medium">Sản phẩm đang bán</h3>
          <p className="text-3xl font-bold text-orange-500 mt-2">
            {stats.totalProducts}
          </p>
        </div>
      </div>
    </div>
  );
}