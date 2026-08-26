"use client";
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Select, SearchBox, Button } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";

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

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value === 'default') {
      params.delete('sort');
      params.delete('order');
    } else if (value === 'price_asc') {
      params.set('sort', 'price');
      params.set('order', 'asc');
    } else if (value === 'price_desc') {
      params.set('sort', 'price');
      params.set('order', 'desc');
    } else if (value === 'newest') {
      params.set('sort', 'newest');
      params.delete('order');
    } else if (value === 'rating' || value === 'bestseller') {
      params.set('sort', 'rating');
      params.set('order', 'desc');
    }

    router.push(`/san-pham?${params.toString()}`);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.push(`/san-pham?${params.toString()}`);
  };

  const currentSort = searchParams.get('sort');
  const currentOrder = searchParams.get('order');
  let selectValue = 'default';
  if (currentSort === 'price' && currentOrder === 'asc') selectValue = 'price_asc';
  else if (currentSort === 'price' && currentOrder === 'desc') selectValue = 'price_desc';
  else if (currentSort === 'newest') selectValue = 'newest';
  else if (currentSort === 'rating') selectValue = 'rating';

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
        <form onSubmit={handleSearch} className="hidden md:block w-64 relative">
          <input
            name="search"
            defaultValue={searchParams.get('search') || ''}
            placeholder="Tìm trong kết quả..."
            className="w-full h-10 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] text-sm text-gray-900 bg-white"
          />
        </form>
        <div className="w-full sm:w-48 shrink-0">
          <Select
            options={sortOptions}
            placeholder="Sắp xếp"
            value={selectValue}
            onChange={(e) => handleSortChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};
