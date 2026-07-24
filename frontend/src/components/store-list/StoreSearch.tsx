import React from "react";
import { Search, MapPin } from "lucide-react";

export const StoreSearch = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6 md:mb-8 animate-in slide-in-from-bottom-4 duration-700 fade-in">
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm placeholder:text-gray-400 font-medium"
          placeholder="Tìm tên cửa hàng, hợp tác xã..."
        />
      </div>

      <div className="relative md:w-72 shrink-0 group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" />
        </div>
        <select className="w-full pl-11 pr-10 py-3.5 sm:py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm appearance-none font-medium text-gray-700 cursor-pointer">
          <option value="">Tất cả địa phương</option>
          <option value="sg">TP. Hồ Chí Minh</option>
          <option value="hn">Hà Nội</option>
          <option value="dl">Đà Lạt - Lâm Đồng</option>
          <option value="ct">Cần Thơ</option>
        </select>
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};
