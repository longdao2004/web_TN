import React from "react";
import { Calendar, PackageOpen, Thermometer, Sparkles, CheckCircle2, Clock } from "lucide-react";
import { Batch } from "@/types/product-detail";

interface BatchInformationProps {
  batch: Batch;
}

export const BatchInformation = ({ batch }: BatchInformationProps) => {
  // 1. Tính toán số ngày còn lại đến khi hết hạn
  const expiryTime = batch?.expiryDate ? new Date(batch.expiryDate).getTime() : 0;
  const now = Date.now();
  const isExpired = expiryTime > 0 && expiryTime <= now;
  const daysLeft = expiryTime > 0 ? Math.ceil((expiryTime - now) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div
      className={`rounded-2xl p-5 border transition-all ${
        isExpired
          ? "bg-red-50/50 border-red-200"
          : "bg-emerald-50/40 border-emerald-200/80 shadow-sm"
      }`}
    >
      {/* TIÊU ĐỀ HỘP TRẠNG THÁI */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 pb-3 border-b border-gray-200/60">
        <div className="flex items-center gap-2">
          {isExpired ? (
            <Clock className="h-5 w-5 text-red-500" />
          ) : (
            <Sparkles className="h-5 w-5 text-emerald-600 animate-pulse" />
          )}
          <h3 className="text-base font-bold text-gray-900">
            {isExpired ? "Thông tin lô hàng (Đã hết hạn)" : "Đợt thu hoạch mới nhất"}
          </h3>
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-gray-600 border border-gray-200 shadow-2xs">
            Lô: #{batch.id ? batch.id.substring(0, 8).toUpperCase() : "N/A"}
          </span>
        </div>

        {/* NHÃN THỜI HẠN SỬ DỤNG */}
        {isExpired ? (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-600 text-white">
            Đã quá hạn
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Còn {daysLeft} ngày sử dụng
          </span>
        )}
      </div>

      {/* LƯỚI THÔNG TIN CHI TIẾT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {/* Ngày thu hoạch */}
        <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100">
          <Calendar className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs font-medium">Ngày thu hoạch / Nhập kho</div>
            <div className="font-bold text-gray-900">
              {batch.harvestDate
                ? new Date(batch.harvestDate).toLocaleDateString("vi-VN")
                : "Đang cập nhật"}
            </div>
          </div>
        </div>

        {/* Hạn sử dụng */}
        <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100">
          <Calendar className={`h-4 w-4 mt-0.5 shrink-0 ${isExpired ? "text-red-500" : "text-amber-500"}`} />
          <div>
            <div className="text-gray-500 text-xs font-medium">Hạn sử dụng</div>
            <div className={`font-bold ${isExpired ? "text-red-600" : "text-gray-900"}`}>
              {batch.expiryDate
                ? new Date(batch.expiryDate).toLocaleDateString("vi-VN")
                : "Đang cập nhật"}
            </div>
          </div>
        </div>

        {/* Quy cách đóng gói */}
        <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100">
          <PackageOpen className="h-4 w-4 text-blue-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs font-medium">Quy cách đóng gói</div>
            <div className="font-semibold text-gray-800">
              {batch.specification || "Đóng gói tiêu chuẩn"}
            </div>
          </div>
        </div>

        {/* Điều kiện bảo quản */}
        <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-gray-100">
          <Thermometer className="h-4 w-4 text-cyan-500 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs font-medium">Bảo quản</div>
            <div className="font-semibold text-gray-800">
              {batch.storageCondition || "Nhiệt độ phòng mát"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};