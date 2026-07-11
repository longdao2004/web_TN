"use client";
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Select, SearchBox, Button } from "@/components/ui";

interface SortBarProps {
  totalItems: number;
  onOpenMobileFilter: () => void;
}

export const SortBar = ({ totalItems, onOpenMobileFilter }: SortBarProps) => {
  const sortOptions = [
    { label: "Mặc định", value: "default" },
    { label: "Mới nhất", value: "newest" },
    { label: "Bán chạy", value: "bestseller" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
    { label: "Đánh giá cao", value: "rating" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-white border border-[var(--color-border)] rounded-xl shadow-sm mb-6">
      {/* Mobile Filter Toggle & Info */}
      <div className="flex items-center justify-between w-full sm:w-auto gap-4">
        <Button
          variant="outline"
          className="lg:hidden shrink-0 flex items-center gap-2"
          onClick={onOpenMobileFilter}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Lọc
        </Button>
        <p className="text-sm text-gray-600 font-medium whitespace-nowrap">
          Hiển thị <span className="font-bold text-gray-900">{totalItems}</span>{" "}
          sản phẩm
        </p>
      </div>

      {/* Search & Sort */}
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <div className="hidden md:block w-64">
          <SearchBox placeholder="Tìm trong kết quả..." />
        </div>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            options={sortOptions}
            placeholder="Sắp xếp"
            defaultValue="default"
          />
        </div>
      </div>
    </div>
  );
};
