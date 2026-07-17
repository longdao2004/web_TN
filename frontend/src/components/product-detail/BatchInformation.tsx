import React from "react";
import { Calendar, PackageOpen, Thermometer } from "lucide-react";
import { Batch } from "@/types/product-detail";

interface BatchInformationProps {
  batch: Batch;
}

export const BatchInformation = ({ batch }: BatchInformationProps) => {
  return (
    <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
      <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        Thông tin lô sản phẩm
        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-200 text-gray-600">
          {batch.id}
        </span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs">Thu hoạch / Đóng gói</div>
            <div className="font-medium text-gray-900">{batch.harvestDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Calendar className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs">Hạn sử dụng</div>
            <div className="font-medium text-gray-900">{batch.expiryDate}</div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <PackageOpen className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs">Quy cách</div>
            <div className="font-medium text-gray-900">
              {batch.specification}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <Thermometer className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <div className="text-gray-500 text-xs">Bảo quản</div>
            <div className="font-medium text-gray-900">
              {batch.storageCondition}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
