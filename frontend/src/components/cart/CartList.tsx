import React from "react";
import { CartItem as ICartItem } from "@/types/cart";
import { CartItem } from "./CartItem";

interface CartListProps {
  items: ICartItem[];
  selectedItemIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectItem: (id: string, selected: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDeleteItem: (id: string) => void;
}

export const CartList = ({
  items,
  selectedItemIds,
  onSelectAll,
  onSelectItem,
  onUpdateQuantity,
  onDeleteItem,
}: CartListProps) => {
  const isAllSelected =
    items.length > 0 && selectedItemIds.length === items.length;

  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-[var(--color-border)] flex items-center justify-between bg-gray-50/50">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <span className="font-semibold text-gray-700">
            Chọn tất cả ({items.length} sản phẩm)
          </span>
        </label>
      </div>

      {/* List */}
      <div className="p-4 sm:p-6 space-y-4">
        {items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            isSelected={selectedItemIds.includes(item.id)}
            onSelect={onSelectItem}
            onUpdateQuantity={onUpdateQuantity}
            onDelete={onDeleteItem}
          />
        ))}
      </div>
    </div>
  );
};
