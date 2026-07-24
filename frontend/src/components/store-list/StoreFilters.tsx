import React from "react";
import { Filter, Star, ShieldCheck, Tag } from "lucide-react";

export const StoreFilters = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-24 animate-in slide-in-from-left-4 duration-700 fade-in">
      <div className="flex items-center gap-2 mb-6 border-b border-gray-50 pb-4">
        <Filter className="w-5 h-5 text-gray-900" />
        <h2 className="text-lg font-bold text-gray-900">Bộ lọc cửa hàng</h2>
      </div>

      <div className="space-y-6">
        {/* Đánh giá */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-gray-400" /> Đánh giá
          </h3>
          <div className="flex flex-col gap-2">
            {["Từ 4 sao trở lên", "Từ 3 sao trở lên"].map((label, idx) => (
              <label
                key={idx}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                  {label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* Chứng nhận */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <ShieldCheck className="w-4 h-4 text-gray-400" /> Chứng nhận
          </h3>
          <div className="flex flex-col gap-2">
            {["VietGAP", "GlobalGAP", "OCOP", "Hữu cơ", "VSATTP"].map(
              (label, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                    {label}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>

        <div className="w-full h-px bg-gray-100"></div>

        {/* Ngành hàng chính */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Tag className="w-4 h-4 text-gray-400" /> Ngành hàng chính
          </h3>
          <div className="flex flex-col gap-2">
            {["Rau củ quả", "Trái cây", "Thịt & Hải sản", "Gạo & Ngũ cốc"].map(
              (label, idx) => (
                <label
                  key={idx}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-emerald-600 transition-colors">
                    {label}
                  </span>
                </label>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
