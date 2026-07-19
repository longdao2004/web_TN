"use client";
import React from "react";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
}

export const QuantitySelector = ({
  quantity,
  maxQuantity,
  onChange,
  disabled,
}: QuantitySelectorProps) => {
  const handleDecrease = () => {
    if (quantity > 1) {
      onChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < maxQuantity) {
      onChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value)) {
      if (value < 1) onChange(1);
      else if (value > maxQuantity) onChange(maxQuantity);
      else onChange(value);
    }
  };

  return (
    <div
      className={`flex items-center h-8 rounded-lg border border-gray-200 bg-white overflow-hidden w-[100px] shrink-0 ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <button
        onClick={handleDecrease}
        disabled={quantity <= 1 || disabled}
        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:bg-white transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </button>

      <input
        type="number"
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        className="w-9 h-full text-center text-sm font-medium text-gray-900 bg-transparent border-x border-gray-200 focus:outline-none appearance-none m-0 p-0"
        style={{ MozAppearance: "textfield" }}
      />

      <button
        onClick={handleIncrease}
        disabled={quantity >= maxQuantity || disabled}
        className="w-8 h-full flex items-center justify-center text-gray-500 hover:bg-gray-50 hover:text-[var(--color-primary)] disabled:opacity-30 disabled:hover:bg-white transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
};
