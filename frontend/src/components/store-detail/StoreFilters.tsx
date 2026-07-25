import React from 'react';
import { Filter, Search } from 'lucide-react';

export const StoreFilters = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24 animate-in slide-in-from-left-4 duration-700 fade-in delay-300">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <Filter className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900">Lọc sản phẩm</h2>
      </div>

      <div className="space-y-6">
        {/* Search in Store */}
        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Tìm trong cửa hàng..." 
            className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Danh mục */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Danh mục</h3>
          <div className="flex flex-col gap-2">
            {['Tất cả', 'Rau xanh', 'Củ quả', 'Trái cây', 'Đặc sản'].map((label, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="store-category" className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked={idx === 0} />
                <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* Sắp xếp */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Sắp xếp</h3>
          <div className="flex flex-col gap-2">
            {['Mới nhất', 'Bán chạy', 'Giá thấp đến cao', 'Giá cao đến thấp'].map((label, idx) => (
              <label key={idx} className="flex items-center gap-3 cursor-pointer group">
                <input type="radio" name="store-sort" className="w-4 h-4 border-gray-300 text-emerald-600 focus:ring-emerald-500" defaultChecked={idx === 0} />
                <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
