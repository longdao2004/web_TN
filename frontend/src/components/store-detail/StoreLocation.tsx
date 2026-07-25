import React from 'react';
import { MapPin } from 'lucide-react';

interface StoreLocationProps {
  address: string;
}

export const StoreLocation = ({ address }: StoreLocationProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in delay-500">
      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-emerald-600" />
        Vị trí cửa hàng
      </h2>
      
      <p className="text-sm text-gray-600 mb-4 font-medium">{address}</p>
      
      <div className="w-full h-64 sm:h-80 bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 flex items-center justify-center">
        {/* Google Maps Placeholder */}
        <div className="absolute inset-0 bg-emerald-50/50"></div>
        <div className="relative text-center z-10 flex flex-col items-center">
          <MapPin className="w-10 h-10 text-emerald-500 mb-2 animate-bounce" />
          <p className="text-sm font-semibold text-emerald-700 bg-white/80 px-3 py-1 rounded-full backdrop-blur-sm border border-emerald-100 shadow-sm">Bản đồ đang được cập nhật</p>
        </div>
      </div>
    </div>
  );
};
