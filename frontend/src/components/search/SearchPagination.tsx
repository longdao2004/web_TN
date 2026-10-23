"use client";
import React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface SearchPaginationProps {
  currentPage?: number;
  totalPages?: number;
  query?: string;
  sort?: string;
}

export const SearchPagination = ({
  currentPage = 1,
  totalPages = 1,
  query = "",
  sort = "newest",
}: SearchPaginationProps) => {
  // 🟢 TỰ ĐỘNG ẨN HOÀN TOÀN: Nếu tổng số trang chỉ có 1 trang (hoặc ít sản phẩm) thì không hiển thị phân trang ảo
  if (totalPages <= 1) return null;

  // Tạo URL phân trang giữ nguyên từ khóa tìm kiếm và tiêu chí sắp xếp
  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (sort && sort !== "newest") params.set("sort", sort);
    if (pageNumber > 1) params.set("page", pageNumber.toString());
    return `/tim-kiem?${params.toString()}`;
  };

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-12 animate-in fade-in duration-500">
      {/* Nút lùi về trang trước */}
      {currentPage > 1 ? (
        <Link
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          title="Trang trước"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Danh sách các số trang thực tế */}
      {pages.map((p) => {
        const isCurrent = p === currentPage;
        return (
          <Link
            key={p}
            href={createPageUrl(p)}
            className={`w-10 h-10 flex items-center justify-center rounded-xl font-bold transition-all ${
              isCurrent
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/20"
                : "border border-gray-200 text-gray-700 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50"
            }`}
          >
            {p}
          </Link>
        );
      })}

      {/* Nút tiến sang trang sau */}
      {currentPage < totalPages ? (
        <Link
          href={createPageUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-300 hover:bg-emerald-50 transition-colors"
          title="Trang sau"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      ) : (
        <button
          disabled
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-300 cursor-not-allowed opacity-50"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
