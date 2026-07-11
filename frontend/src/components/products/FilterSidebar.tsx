"use client";
import React, { useState } from "react";
import { ChevronDown, Filter, X } from "lucide-react";
import { Checkbox, Radio, Button } from "@/components/ui";

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export const FilterSidebar = ({ onCloseMobile }: FilterSidebarProps) => {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Mobile Only */}
      <div className="flex items-center justify-between lg:hidden pb-4 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Lọc sản phẩm
        </h2>
        {onCloseMobile && (
          <Button variant="ghost" size="icon" onClick={onCloseMobile}>
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="hidden lg:flex items-center justify-between pb-2 border-b border-[var(--color-border)]">
        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Bộ lọc
        </h2>
        <button className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors">
          Xóa tất cả
        </button>
      </div>

      {/* Categories */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Danh mục</h3>
        <div className="flex flex-col gap-2.5">
          <Checkbox id="cat-1" label="Rau củ quả (120)" />
          <Checkbox id="cat-2" label="Trái cây (85)" />
          <Checkbox id="cat-3" label="Thịt tươi (40)" />
          <Checkbox id="cat-4" label="Hải sản (62)" />
          <Checkbox id="cat-5" label="Gạo & Ngũ cốc (30)" />
        </div>
      </div>

      <hr className="border-[var(--color-border)]" />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
        <div className="flex flex-col gap-2.5">
          <Radio
            name="price"
            id="price-all"
            value="all"
            label="Tất cả mức giá"
            defaultChecked
          />
          <Radio name="price" id="price-1" value="1" label="Dưới 50.000đ" />
          <Radio
            name="price"
            id="price-2"
            value="2"
            label="50.000đ - 200.000đ"
          />
          <Radio
            name="price"
            id="price-3"
            value="3"
            label="200.000đ - 500.000đ"
          />
          <Radio name="price" id="price-4" value="4" label="Trên 500.000đ" />
        </div>
      </div>

      <hr className="border-[var(--color-border)]" />

      {/* Certificates */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Chứng nhận</h3>
        <div className="flex flex-col gap-2.5">
          <Checkbox id="cert-organic" label="Hữu cơ (Organic)" />
          <Checkbox id="cert-vietgap" label="VietGAP" />
          <Checkbox id="cert-globalgap" label="GlobalGAP" />
          <Checkbox id="cert-ocop" label="OCOP" />
        </div>
      </div>

      <hr className="border-[var(--color-border)]" />

      {/* Provinces */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Khu vực</h3>
        <div className="flex flex-col gap-2.5 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300">
          <Checkbox id="prov-1" label="Lâm Đồng" />
          <Checkbox id="prov-2" label="Hà Nội" />
          <Checkbox id="prov-3" label="TP. Hồ Chí Minh" />
          <Checkbox id="prov-4" label="Sơn La" />
          <Checkbox id="prov-5" label="Cà Mau" />
          <Checkbox id="prov-6" label="Sóc Trăng" />
        </div>
      </div>

      <hr className="border-[var(--color-border)]" />

      {/* Rating */}
      <div className="flex flex-col gap-3 mb-6 lg:mb-0">
        <h3 className="font-semibold text-gray-900">Đánh giá</h3>
        <div className="flex flex-col gap-2.5">
          <Radio name="rating" id="rate-5" value="5" label="Từ 5 sao" />
          <Radio name="rating" id="rate-4" value="4" label="Từ 4 sao trở lên" />
          <Radio name="rating" id="rate-3" value="3" label="Từ 3 sao trở lên" />
        </div>
      </div>
    </div>
  );
};
