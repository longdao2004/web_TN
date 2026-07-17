"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  stock: number;
  quantity: number;
  onChange: (value: number) => void;
}

export const QuantitySelector = ({
  stock,
  quantity,
  onChange,
}: QuantitySelectorProps) => {
  const decrease = () => {
    if (quantity > 1) onChange(quantity - 1);
  };

  const increase = () => {
    if (quantity < stock) onChange(quantity + 1);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        <div className="flex items-center h-10 w-32 rounded-lg border border-gray-200 bg-white">
          <button
            type="button"
            onClick={decrease}
            disabled={quantity <= 1}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-l-lg h-full"
            aria-label="Giảm số lượng"
          >
            <Minus className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={quantity}
            onChange={handleChange}
            className="w-10 text-center font-semibold text-gray-900 border-none outline-none bg-transparent"
          />

          <button
            type="button"
            onClick={increase}
            disabled={quantity >= stock}
            className="flex-1 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors rounded-r-lg h-full"
            aria-label="Tăng số lượng"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <span className="text-sm text-gray-500">
          {stock > 0 ? (
            `Còn ${stock} sản phẩm`
          ) : (
            <span className="text-red-500 font-medium">Hết hàng</span>
          )}
        </span>
      </div>
    </div>
  );
};
