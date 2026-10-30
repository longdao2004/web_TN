import React from "react";
import Link from "next/link";
import { Trash2, Store as StoreIcon, AlertTriangle } from "lucide-react";
import { CartItem as ICartItem } from "@/types/cart";
import { QuantitySelector } from "./QuantitySelector";
import { Badge } from "@/components/ui";
import Image from "next/image";

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
  const isExpired = item.isExpired === true;

  return (
    <div
      className={`flex flex-col sm:flex-row gap-4 p-4 border rounded-2xl transition-colors group ${
        isExpired
          ? "bg-red-50/20 border-red-200 opacity-80"
          : "bg-white border-gray-100 hover:border-[var(--color-primary-light)]"
      }`}
    >
      {/* Cột trái: Checkbox và Ảnh sản phẩm */}
      <div className="flex items-center gap-4">
        <label
          className={`flex items-center shrink-0 ${
            isExpired ? "cursor-not-allowed opacity-40" : "cursor-pointer"
          }`}
          title={isExpired ? "Sản phẩm đã hết hạn, không thể chọn thanh toán" : ""}
        >
          <input
            type="checkbox"
            disabled={isExpired}
            className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] disabled:cursor-not-allowed"
            checked={!isExpired && isSelected}
            onChange={(e) => onSelect(item.id, e.target.checked)}
          />
        </label>

        <Link href={`/san-pham/${item.slug}`} className="shrink-0">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 relative">
            <Image
              src={item.image}
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                isExpired ? "grayscale-[40%]" : "group-hover:scale-105"
              }`}
              width={500}
              height={500}
            />
            {isExpired && (
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-1 text-center">
                <span className="text-[10px] font-bold text-white bg-red-600 px-1.5 py-0.5 rounded shadow">
                  HẾT HẠN
                </span>
              </div>
            )}
          </div>
        </Link>
      </div>

      {/* Thông tin chính của sản phẩm */}
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start gap-4">
          <div>
            {/* Danh mục, Hết hạn & Chứng nhận */}
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              {isExpired ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">
                  <AlertTriangle className="h-3 w-3" />
                  Đã hết hạn sử dụng
                </span>
              ) : (
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
                  {item.category}
                </span>
              )}

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

            {/* Tên sản phẩm */}
            <Link href={`/san-pham/${item.slug}`}>
              <h3
                className={`font-bold text-sm sm:text-base line-clamp-2 transition-colors ${
                  isExpired
                    ? "text-gray-500 hover:text-red-600"
                    : "text-gray-900 hover:text-[var(--color-primary)]"
                }`}
              >
                {item.name}
              </h3>
            </Link>

            {/* Tên cửa hàng */}
            <Link
              href={
                item.store?.id && item.store.id !== '1' && item.store.id !== 'unknown'
                  ? `/cua-hang/${item.store.id}`
                  : item.store?.slug && item.store.slug !== 'cua-hang'
                    ? `/cua-hang/${item.store.slug}`
                    : '/cua-hang'
              }
              className="flex items-center gap-1.5 mt-2 text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors w-fit"
            >
              <StoreIcon className="h-3.5 w-3.5" />
              {item.store.name}
            </Link>
          </div>

          {/* Nút Xóa sản phẩm */}
          <button
            onClick={() => onDelete(item.id)}
            className="text-gray-400 hover:text-red-500 p-2 -mr-2 rounded-full hover:bg-red-50 transition-colors shrink-0"
            title="Xóa sản phẩm khỏi giỏ hàng"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>

        {/* Giá tiền và Số lượng */}
        <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
          <div className="flex flex-col">
            {item.originalPrice && (
              <span className="text-xs text-gray-400 line-through mb-0.5">
                {formatCurrency(item.originalPrice)}
              </span>
            )}
            <span
              className={`font-bold ${
                isExpired ? "text-gray-400" : "text-[var(--color-primary)]"
              }`}
            >
              {formatCurrency(item.price)}
            </span>
          </div>

          <div className="flex items-center gap-4 sm:gap-8">
            {isExpired ? (
              <span className="text-xs text-red-500 font-medium italic">
                Không thể mua hàng
              </span>
            ) : (
              <QuantitySelector
                quantity={item.quantity}
                maxQuantity={item.maxQuantity}
                onChange={(q) => onUpdateQuantity(item.id, q)}
              />
            )}

            <div className="hidden sm:block text-right min-w-[100px]">
              <div className="text-xs text-gray-500 mb-1">Thành tiền</div>
              <div
                className={`font-bold ${
                  isExpired ? "text-gray-400 line-through" : "text-gray-900"
                }`}
              >
                {formatCurrency(itemTotal)}
              </div>
            </div>
          </div>
        </div>

        {/* Tổng tiền trên mobile */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500">Thành tiền:</span>
          <span
            className={`font-bold text-lg ${
              isExpired ? "text-gray-400 line-through" : "text-gray-900"
            }`}
          >
            {formatCurrency(itemTotal)}
          </span>
        </div>
      </div>
    </div>
  );
};