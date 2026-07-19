import React from "react";
import Link from "next/link";
import { Trash2, Store as StoreIcon } from "lucide-react";
import { CartItem as ICartItem } from "@/types/cart";
import { QuantitySelector } from "./QuantitySelector";
import { Badge } from "@/components/ui";

interface CartItemProps {
  item: ICartItem;
  isSelected: boolean;
  onSelect: (id: string, selected: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDelete: (id: string) => void;
}

export const CartItem = ({
  item,
  isSelected,
  onSelect,
  onUpdateQuantity,
  onDelete,
}: CartItemProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  const itemTotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-100 rounded-2xl bg-white hover:border-[var(--color-primary-light)] transition-colors group">
      {/* Left controls & Image */}
      <div className="flex items-center gap-4">
        <label className="flex items-center cursor-pointer shrink-0">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
            checked={isSelected}
            onChange={(e) => onSelect(item.id, e.target.checked)}
          />
        </label>

        <Link href={`/san-pham/${item.slug}`} className="shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
            />
          </div>
        </Link>
      </div>

      {/* Main Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            {/* Category & Certificates */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                {item.category}
              </span>
              {item.certificates?.map((cert) => (
                <Badge
                  key={cert}
                  variant="outline"
                  size="sm"
                  className="bg-emerald-50 text-emerald-700 border-emerald-200"
                >
                  {cert}
                </Badge>
              ))}
            </div>

            {/* Title */}
            <Link href={`/san-pham/${item.slug}`}>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base line-clamp-2 hover:text-[var(--color-primary)] transition-colors">
                {item.name}
              </h3>
            </Link>

            {/* Store */}
            <Link
              href={`/cua-hang/${item.store.slug}`}
              className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors w-fit"
            >
              <StoreIcon className="h-3.5 w-3.5" />
              {item.store.name}
            </Link>
          </div>

          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-400 hover:text-red-500 p-2 -mr-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
            title="Xóa sản phẩm"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Pricing & Quantity */}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
          <div className="flex flex-col">
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through mb-0.5">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
            <span className="font-bold text-[var(--color-primary)]">
              {formatCurrency(item.price)}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            <QuantitySelector
              quantity={item.quantity}
              maxQuantity={item.maxQuantity}
              onChange={(q) => onUpdateQuantity(item.id, q)}
            />

            <div className="hidden sm:block text-right min-w-[100px]">
              <div className="text-xs text-gray-500 mb-1">Thành tiền</div>
              <div className="font-bold text-gray-900">
                {formatCurrency(itemTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Total */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Thành tiền:</span>
          <span className="font-bold text-gray-900 text-lg">
            {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};
