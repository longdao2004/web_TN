"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  stock: number;
  quantity: number;
  onChange: (value: number) => void;
  // 🟢 Bổ sung cờ vô hiệu hóa khi sản phẩm hết hàng hoặc hết hạn
  disabled?: boolean;
  isExpired?: boolean;
}

export const QuantitySelector = ({
  stock,
  quantity,
  onChange,
  disabled = false,
  isExpired = false,
}: QuantitySelectorProps) => {
  const isActionDisabled = disabled || isExpired || stock <= 0;

  const decrease = () => {
    if (!isActionDisabled && quantity > 1) onChange(quantity - 1);
  };

  const increase = () => {
    if (!isActionDisabled && quantity < stock) onChange(quantity + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isActionDisabled) return;
    const val = parseInt(e.target.value);
    if (!isNaN(val)) {
      if (val < 1) onChange(1);
      else if (val > stock) onChange(stock);
      else onChange(val);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-gray-900">Số lượng</span>
      <div className="flex items-center gap-4">
        {/* Hộp chọn số lượng */}
        <div
          className={`flex items-center h-10 w-32 rounded-lg border border-gray-200 transition-colors ${
            isActionDisabled
              ? "bg-gray-100 opacity-60 cursor-not-allowed"
              : "bg-white"
          }`}
        >
          <button
            type="button"
            onClick={decrease}
            disabled={isActionDisabled || quantity <= 1}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg h-full"
            aria-label="Giảm số lượng"
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={isExpired || stock <= 0 ? 0 : quantity}
            onChange={handleChange}
            disabled={isActionDisabled}
            className={`w-10 text-center font-semibold text-gray-900 border-none outline-none bg-transparent ${
              isActionDisabled ? "cursor-not-allowed text-gray-400" : ""
            }`}
          />

          <button
            type="button"
            onClick={increase}
            disabled={isActionDisabled || quantity >= stock}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg h-full"
            aria-label="Tăng số lượng"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        {/* Trạng thái kho / hạn sử dụng */}
        <span className="text-sm text-gray-500">
          {isExpired ? (
            <span className="text-red-500 font-medium">Lô hàng đã hết hạn</span>
          ) : stock > 0 ? (
            `Còn ${stock} sản phẩm`
          ) : (
            <span className="text-red-500 font-medium">Hết hàng</span>
          )}
        </span>
      </div>
    </div>
  );
};
