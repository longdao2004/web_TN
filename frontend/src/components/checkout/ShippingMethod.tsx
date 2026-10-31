import React from "react";
import { ShippingMethod as IShippingMethod } from "@/types/checkout";
import { Truck } from "lucide-react";
import { Radio } from "@/components/ui";

interface ShippingMethodProps {
  methods: IShippingMethod[];
  selectedId: string;
  onChange: (id: string) => void;
}

export const ShippingMethod: React.FC<ShippingMethodProps> = ({
  methods,
  selectedId,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Truck className="h-5 w-5 text-emerald-500" />
        Phương thức giao hàng
      </h3>

      <div className="space-y-3">
        {methods.map((method) => {
          const isSelected = selectedId === method.id;
          const isDisabled = method.disabled === true;

          return (
            <div
              key={method.id}
              onClick={() => {
                if (!isDisabled) {
                  onChange(method.id);
                }
              }}
              className={`relative flex items-start p-4 rounded-xl border-2 transition-all duration-200 ${
                isDisabled
                  ? "border-gray-200 bg-gray-50/70 opacity-60 cursor-not-allowed"
                  : isSelected
                  ? "border-emerald-500 bg-emerald-50/50 cursor-pointer shadow-sm"
                  : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              <Radio
                checked={isSelected && !isDisabled}
                disabled={isDisabled}
                onChange={() => !isDisabled && onChange(method.id)}
                className="mt-1"
              />
              <div className="ml-3 flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p
                      className={`font-semibold text-sm ${
                        isDisabled
                          ? "text-gray-400"
                          : isSelected
                          ? "text-emerald-800"
                          : "text-gray-700"
                      }`}
                    >
                      {method.name}
                    </p>
                    {method.badge && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {method.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {method.estimatedTime}
                  </p>
                  {/* Nhãn cảnh báo lý do không khả dụng */}
                  {method.disabledReason && (
                    <p className="text-[11px] font-medium text-red-500 mt-1 flex items-center gap-1">
                      ⚠️ {method.disabledReason}
                    </p>
                  )}
                </div>
                <div className="text-right sm:self-center">
                  <span
                    className={`font-bold text-sm ${
                      isDisabled
                        ? "text-gray-400"
                        : isSelected
                        ? "text-emerald-600"
                        : "text-gray-900"
                    }`}
                  >
                    {method.price === 0
                      ? "Miễn phí"
                      : `${method.price.toLocaleString("vi-VN")}đ`}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};