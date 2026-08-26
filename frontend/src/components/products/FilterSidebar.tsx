"use client";
import React, { useState, useEffect } from "react";
import { Filter, X } from "lucide-react";
import { Checkbox, Radio, Button } from "@/components/ui";
import { useRouter, useSearchParams } from "next/navigation";
import { categoryService } from "@/services/category.service";

interface FilterSidebarProps {
  onCloseMobile?: () => void;
}

export const FilterSidebar = ({ onCloseMobile }: FilterSidebarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(console.error);
  }, []);

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/san-pham?${params.toString()}`, { scroll: false });
  };

  const handleCategoryChange = (catId: string, checked: boolean) => {
    // Để đơn giản, chúng ta chỉ sử dụng một bộ lọc danh mục duy nhất trong URL
    if (checked) {
      updateParam('category', catId);
    } else {
      updateParam('category', null);
    }
  };

  const handlePriceChange = (value: string) => {
    if (value === 'all') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('minPrice');
      params.delete('maxPrice');
      router.push(`/san-pham?${params.toString()}`, { scroll: false });
    } else if (value === '1') {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('minPrice');
      params.set('maxPrice', '50000');
      router.push(`/san-pham?${params.toString()}`, { scroll: false });
    } else if (value === '2') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', '50000');
      params.set('maxPrice', '200000');
      router.push(`/san-pham?${params.toString()}`, { scroll: false });
    } else if (value === '3') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', '200000');
      params.set('maxPrice', '500000');
      router.push(`/san-pham?${params.toString()}`, { scroll: false });
    } else if (value === '4') {
      const params = new URLSearchParams(searchParams.toString());
      params.set('minPrice', '500000');
      params.delete('maxPrice');
      router.push(`/san-pham?${params.toString()}`, { scroll: false });
    }
  };

  const currentCategory = searchParams.get('category');
  let currentPrice = 'all';
  if (!searchParams.get('minPrice') && searchParams.get('maxPrice') === '50000') currentPrice = '1';
  if (searchParams.get('minPrice') === '50000' && searchParams.get('maxPrice') === '200000') currentPrice = '2';
  if (searchParams.get('minPrice') === '200000' && searchParams.get('maxPrice') === '500000') currentPrice = '3';
  if (searchParams.get('minPrice') === '500000' && !searchParams.get('maxPrice')) currentPrice = '4';

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header chỉ dành cho di động */}
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
        <button 
          onClick={() => router.push('/san-pham')}
          className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      {/* Các danh mục */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Danh mục</h3>
        <div className="flex flex-col gap-2.5">
          {categories.map((cat) => (
            <Checkbox 
              key={cat.id} 
              id={`cat-${cat.id}`} 
              label={cat.name} 
              checked={currentCategory === cat.id}
              onChange={(e) => handleCategoryChange(cat.id, e.target.checked)}
            />
          ))}
        </div>
      </div>

      <hr className="border-[var(--color-border)]" />

      {/* Khoảng giá */}
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-gray-900">Khoảng giá</h3>
        <div className="flex flex-col gap-2.5">
          <Radio
            name="price"
            id="price-all"
            value="all"
            label="Tất cả mức giá"
            checked={currentPrice === 'all'}
            onChange={() => handlePriceChange('all')}
          />
          <Radio name="price" id="price-1" value="1" label="Dưới 50.000đ" checked={currentPrice === '1'} onChange={() => handlePriceChange('1')} />
          <Radio name="price" id="price-2" value="2" label="50.000đ - 200.000đ" checked={currentPrice === '2'} onChange={() => handlePriceChange('2')} />
          <Radio name="price" id="price-3" value="3" label="200.000đ - 500.000đ" checked={currentPrice === '3'} onChange={() => handlePriceChange('3')} />
          <Radio name="price" id="price-4" value="4" label="Trên 500.000đ" checked={currentPrice === '4'} onChange={() => handlePriceChange('4')} />
        </div>
      </div>
    </div>
  );
};
