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
          return (
            <div
              key={method.id}
              onClick={() => onChange(method.id)}
              className={`relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/50"
                  : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50"
              }`}
            >
              <Radio
                checked={isSelected}
                onChange={() => onChange(method.id)}
                className="mt-0.5"
              />
              <div className="ml-3 flex-1 flex items-center justify-between">
                <div>
                  <p
                    className={`font-semibold text-sm ${isSelected ? "text-emerald-800" : "text-gray-700"}`}
                  >
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {method.estimatedTime}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`font-bold ${isSelected ? "text-emerald-600" : "text-gray-900"}`}
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
