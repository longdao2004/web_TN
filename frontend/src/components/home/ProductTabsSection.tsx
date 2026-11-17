"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Sparkles,
  Flame,
  Clock,
  Tag,
  ArrowRight,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { PageContainer, Section } from "@/components/layout/core";
import { ProductCard } from "./components/ProductCard";
import { productService } from "@/services/product.service";

// 1. Định nghĩa các Tab hiển thị
type TabType = "all" | "newest" | "bestseller" | "sale" | "expired";

export const ProductTabsSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isLoading, setIsLoading] = useState(true);

  // 2. State quản lý phân trang
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ITEMS_PER_PAGE = 8; // Số sản phẩm trên mỗi trang

  // 3. Tải toàn bộ danh sách sản phẩm từ API
  useEffect(() => {
    productService
      .getProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // 4. Lấy TOÀN BỘ sản phẩm của Tab (không dùng slice cố định 8 sản phẩm nữa)
  const allTabProducts = useMemo(() => {
    const activeProducts = products.filter((p) => !p.isExpired);
    const expiredProducts = products.filter((p) => p.isExpired);

    switch (activeTab) {
      case "newest":
        return activeProducts;

      case "bestseller":
        return [...activeProducts].sort(
          (a, b) =>
            (b.soldCount || 0) - (a.soldCount || 0) ||
            (b.rating || 0) - (a.rating || 0)
        );

      case "sale":
        return activeProducts.filter(
          (p) => p.originalPrice && p.originalPrice > p.price
        );

      case "expired":
        return expiredProducts;

      case "all":
      default:
        return activeProducts;
    }
  }, [products, activeTab]);

  // 5. Tính toán tổng số trang và cắt danh sách sản phẩm theo trang hiện tại
  const totalPages = Math.ceil(allTabProducts.length / ITEMS_PER_PAGE) || 1;

  const currentProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return allTabProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [allTabProducts, currentPage]);

  // 6. Danh sách các Tab trên thanh điều hướng
  const tabs = [
    { id: "all", label: "Tất cả nông sản", icon: Sparkles },
    { id: "newest", label: "Mới lên kệ", icon: Clock },
    { id: "bestseller", label: "Bán chạy nhất", icon: Flame },
    { id: "sale", label: "Đang ưu đãi", icon: Tag },
    { id: "expired", label: "Đã hết hạn", icon: AlertTriangle },
  ];

  return (
    <Section bgClass="bg-white">
      <PageContainer>
        {/* TIÊU ĐỀ SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Gợi ý hôm nay
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Khám phá nông sản tươi sạch
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Nông sản đạt chuẩn, thu hoạch tận vườn & giao nhanh giữ trọn độ tươi
            </p>
          </div>

          <Link
            href="/san-pham"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 hover:underline group"
          >
            Xem tất cả sản phẩm
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* THANH TABS CHUYỂN ĐỔI */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isExpiredTab = tab.id === "expired";

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as TabType);
                  setCurrentPage(1); // Luôn trở về trang 1 khi người dùng đổi tab
                }}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? isExpiredTab
                      ? "bg-red-600 text-white shadow-md shadow-red-600/20 scale-105"
                      : "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : isExpiredTab
                      ? "bg-red-50 text-red-600 hover:bg-red-100/80"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? "text-white"
                      : isExpiredTab
                        ? "text-red-500"
                        : "text-gray-500"
                  }`}
                />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LƯỚI SẢN PHẨM HIỂN THỊ */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Đang tải nông sản...</div>
        ) : allTabProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
            {activeTab === "expired"
              ? "Tuyệt vời! Hiện không có sản phẩm nào bị quá hạn sử dụng."
              : "Chưa có sản phẩm nào trong mục này."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6 animate-in fade-in duration-300">
            {currentProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
          </div>
        )}

        {/* THANH ĐIỀU HƯỚNG PHÂN TRANG (PAGINATION) */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100">
            {/* Thông tin số lượng hiển thị */}
            <p className="text-xs text-gray-500 font-medium order-2 sm:order-1">
              Hiển thị{" "}
              <span className="font-bold text-gray-800">
                {(currentPage - 1) * ITEMS_PER_PAGE + 1}
              </span>{" "}
              -{" "}
              <span className="font-bold text-gray-800">
                {Math.min(currentPage * ITEMS_PER_PAGE, allTabProducts.length)}
              </span>{" "}
              trên tổng số{" "}
              <span className="font-bold text-emerald-700">
                {allTabProducts.length}
              </span>{" "}
              nông sản
            </p>

            {/* Cụm nút chuyển trang */}
            <div className="flex items-center gap-1.5 order-1 sm:order-2">
              {/* Nút lùi trang */}
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Danh sách các số trang: 1, 2, 3... */}
              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 scale-105"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              {/* Nút tiến trang */}
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-emerald-50 hover:text-emerald-700 disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-gray-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                title="Trang tiếp theo"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* NÚT XEM THÊM TRÊN MOBILE */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            href="/san-pham"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-sm font-bold text-gray-700 hover:bg-gray-50"
          >
            Xem tất cả nông sản <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </PageContainer>
    </Section>
  );
};