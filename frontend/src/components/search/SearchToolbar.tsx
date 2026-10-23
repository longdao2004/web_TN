"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { ArrowUpDown } from "lucide-react";

interface SearchToolbarProps {
  currentSort?: string;
  query?: string;
}

export const SearchToolbar = ({
  currentSort = "newest",
  query = "",
}: SearchToolbarProps) => {
  const router = useRouter();

  // Danh sách các tùy chọn sắp xếp kết quả tìm kiếm
  const SORT_OPTIONS = [
    { label: "Mới nhất", value: "newest" },
    { label: "Bán chạy", value: "bestseller" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
    { label: "Đánh giá", value: "rating" },
  ];

  // Xử lý khi người dùng click vào một tiêu chí sắp xếp
  const handleSortChange = (sortValue: string) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sortValue !== "newest") {
      params.set("sort", sortValue);
    }
    router.push(`/tim-kiem?${params.toString()}`);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-100 shadow-sm animate-in fade-in duration-300">
      <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 pl-1">
        <ArrowUpDown className="w-4 h-4 text-emerald-600" />
        <span>Sắp xếp theo:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
        {SORT_OPTIONS.map((option) => {
          const isActive =
            currentSort === option.value ||
            (!currentSort && option.value === "newest");

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => handleSortChange(option.value)}
              className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-300 font-bold shadow-sm"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-emerald-600"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
