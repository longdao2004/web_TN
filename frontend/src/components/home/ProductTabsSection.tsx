"use client";
import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Sparkles, Flame, Clock, Tag, ArrowRight } from "lucide-react";
import { PageContainer, Section } from "@/components/layout/core";
import { ProductCard } from "./components/ProductCard";
import { productService } from "@/services/product.service";

type TabType = "all" | "newest" | "bestseller" | "sale";

export const ProductTabsSection = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    productService
      .getProducts()
      .then((data) => setProducts(data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  // Lọc danh sách sản phẩm tức thì theo từng Tab
  const filteredProducts = useMemo(() => {
    let list = [...products];
    switch (activeTab) {
      case "newest":
        // Sản phẩm mới nhất (giữ nguyên thứ tự mới nhất từ Backend)
        return list.slice(0, 8);
      case "bestseller":
        // Sản phẩm bán chạy nhất / đánh giá cao nhất
        return list
          .sort((a, b) => (b.reviews || 0) - (a.reviews || 0) || (b.rating || 0) - (a.rating || 0))
          .slice(0, 8);
      case "sale":
        // Sản phẩm đang có giá gốc giảm giá (khuyến mãi)
        const saleList = list.filter((p) => p.originalPrice && p.originalPrice > p.price);
        return (saleList.length > 0 ? saleList : list).slice(0, 8);
      case "all":
      default:
        return list.slice(0, 8);
    }
  }, [products, activeTab]);

  const tabs = [
    { id: "all", label: "Tất cả nông sản", icon: Sparkles },
    { id: "newest", label: "Mới lên kệ", icon: Clock },
    { id: "bestseller", label: "Bán chạy nhất", icon: Flame },
    { id: "sale", label: "Đang ưu đãi", icon: Tag },
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

        {/* THANH TABS CHUYỂN ĐỔI THÔNG MINH */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-8 no-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-105"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200/80 hover:text-gray-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* LƯỚI SẢN PHẨM HIỂN THỊ */}
        {isLoading ? (
          <div className="py-20 text-center text-gray-400">Đang tải nông sản tươi ngon...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center text-gray-400 bg-gray-50 rounded-2xl border border-gray-100">
            Chưa có sản phẩm nào trong mục này.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:gap-6 animate-in fade-in duration-300">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 4} />
            ))}
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