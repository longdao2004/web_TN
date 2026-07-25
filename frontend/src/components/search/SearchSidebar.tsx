"use client";
import React from 'react';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui';

export const SearchSidebar = () => {
  const filterGroups = [
    {
      title: 'Danh mục',
      options: ['Rau ăn lá', 'Củ quả', 'Trái cây', 'Thịt & Hải sản', 'Đặc sản địa phương', 'Gạo & Ngũ cốc']
    },
    {
      title: 'Nơi bán',
      options: ['Đà Lạt', 'Hà Nội', 'Hồ Chí Minh', 'Mộc Châu', 'Cần Thơ']
    },
    {
      title: 'Đánh giá',
      options: ['Từ 5 sao', 'Từ 4 sao', 'Từ 3 sao']
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24 animate-in slide-in-from-left-4 duration-700 fade-in delay-200">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <Filter className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc tìm kiếm</h2>
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Khoảng giá</h3>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="TỪ" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
            <span className="text-gray-400">-</span>
            <input type="number" placeholder="ĐẾN" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500" />
          </div>
          <button className="w-full mt-3 py-2 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-lg hover:bg-emerald-100 transition-colors">
            Áp dụng
          </button>
        </div>

        {/* Dynamic Groups */}
        {filterGroups.map((group, groupIdx) => (
          <div key={groupIdx}>
            <div className="w-full h-px bg-gray-100 mb-4"></div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">{group.title}</h3>
            <div className="flex flex-col gap-2">
              {group.options.map((option, idx) => (
                <label key={idx} className="flex items-center gap-3 cursor-pointer group/label">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                  <span className="text-sm text-gray-600 group-hover/label:text-emerald-600 transition-colors">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <div className="w-full h-px bg-gray-100 mb-4"></div>
        
        {/* Certificates */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Chứng nhận</h3>
          <div className="flex flex-wrap gap-2">
            {['VietGAP', 'GlobalGAP', 'Organic', 'OCOP'].map((cert, idx) => (
              <Badge key={idx} variant="secondary" className="cursor-pointer hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors font-medium bg-gray-50 text-gray-600 border border-gray-200">
                {cert}
              </Badge>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
