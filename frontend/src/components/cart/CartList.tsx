import React, { useMemo } from "react";
import Link from "next/link";
import { Store, ChevronRight, ShoppingBag } from "lucide-react";
import { CartItem as ICartItem } from "@/types/cart";
import { CartItem } from "./CartItem";

interface CartListProps {
  items: ICartItem[];
  selectedItemIds: string[];
  onSelectAll: (selected: boolean) => void;
  onSelectItem: (id: string, selected: boolean) => void;
  onSelectStore: (storeKey: string, selected: boolean) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onDeleteItem: (id: string) => void;
  onCheckoutStore?: (storeKey: string) => void;
}

export const CartList = ({
  items,
  selectedItemIds,
  onSelectAll,
  onSelectItem,
  onSelectStore,
  onUpdateQuantity,
  onDeleteItem,
  onCheckoutStore,
}: CartListProps) => {
  // 🟢 1. PHÂN NHÓM SẢN PHẨM THEO TỪNG CỬA HÀNG (STORE GROUPING)
  // Mỗi gian hàng sẽ là một khối thẻ riêng biệt, giúp người dùng dễ dàng quản lý và thanh toán từng nơi
  const storeGroups = useMemo(() => {
    const groupsMap: Record<
      string,
      {
        storeKey: string;
        storeId: string;
        storeName: string;
        storeSlug?: string;
        items: ICartItem[];
      }
    > = {};

    for (const item of items) {
      const storeKey = item.store?.id || item.store?.name || "unknown-store";
      if (!groupsMap[storeKey]) {
        groupsMap[storeKey] = {
          storeKey,
          storeId: item.store?.id || storeKey,
          storeName: item.store?.name || "Gian hàng Nông sản",
          storeSlug: item.store?.slug || item.store?.id || "",
          items: [],
        };
      }
      groupsMap[storeKey].items.push(item);
    }

    return Object.values(groupsMap);
  }, [items]);

  // Kiểm tra xem tất cả các món (còn hạn) có đang được chọn hay không
  const activeItems = items.filter((i) => !i.isExpired);
  const isAllSelected =
    activeItems.length > 0 &&
    activeItems.every((item) => selectedItemIds.includes(item.id));

  // Kiểm tra giỏ hàng có nhiều gian hàng hay không
  const hasMultipleStores = storeGroups.length > 1;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* 🟢 HEADER CHỌN TOÀN BỘ SẢN PHẨM TRONG GIỎ */}
      <div className="bg-white rounded-2xl p-4 border border-[var(--color-border)] shadow-sm flex items-center justify-between">
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
            checked={isAllSelected}
            onChange={(e) => onSelectAll(e.target.checked)}
          />
          <span className="font-semibold text-gray-700 text-sm">
            Chọn tất cả ({activeItems.length} sản phẩm{hasMultipleStores ? ` từ ${storeGroups.length} gian hàng` : ""})
          </span>
        </label>
        {selectedItemIds.length > 0 && (
          <span className="text-xs text-emerald-600 font-semibold">
            Đã chọn {selectedItemIds.length} món
          </span>
        )}
      </div>

      {/* 🟢 2. DANH SÁCH CÁC KHỐI GIAN HÀNG (STORE BLOCKS) */}
      {storeGroups.map((group) => {
        // Lọc danh sách sản phẩm còn hạn của shop này
        const storeActiveItems = group.items.filter((i) => !i.isExpired);
        // Kiểm tra xem tất cả món của shop này đã được chọn chưa
        const isStoreAllSelected =
          storeActiveItems.length > 0 &&
          storeActiveItems.every((item) => selectedItemIds.includes(item.id));

        // Đếm số món của shop này đang được chọn
        const selectedStoreItems = group.items.filter((i) =>
          selectedItemIds.includes(i.id)
        );
        const storeSubtotal = selectedStoreItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );

        return (
          <div
            key={group.storeKey}
            className={`bg-white rounded-3xl border transition-all duration-200 shadow-sm overflow-hidden ${
              selectedStoreItems.length > 0
                ? "border-emerald-300 ring-1 ring-emerald-300/40"
                : "border-[var(--color-border)]"
            }`}
          >
            {/* --- HEADER GIAN HÀNG --- */}
            <div className="p-4 sm:p-5 bg-gradient-to-r from-gray-50/80 via-white to-gray-50/40 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {/* Checkbox chọn toàn bộ sản phẩm của gian hàng này */}
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 rounded border-gray-300 text-[var(--color-primary)] focus:ring-[var(--color-primary)] cursor-pointer"
                    checked={isStoreAllSelected}
                    onChange={(e) =>
                      onSelectStore(group.storeKey, e.target.checked)
                    }
                  />
                </label>

                {/* Tên gian hàng & Link xem shop */}
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                    <Store className="w-4 h-4" />
                  </div>
                  <Link
                    href={`/cua-hang/${group.storeId}`}
                    className="font-bold text-gray-900 hover:text-emerald-600 transition-colors text-sm sm:text-base flex items-center gap-1 group/link"
                  >
                    <span>{group.storeName}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400 group-hover/link:text-emerald-600 group-hover/link:translate-x-0.5 transition-all" />
                  </Link>
                </div>
              </div>

              {/* Huy hiệu số món của gian hàng */}
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                {group.items.length} món
              </span>
            </div>

            {/* --- DANH SÁCH MÓN HÀNG CỦA SHOP NÀY --- */}
            <div className="p-4 sm:p-6 space-y-4">
              {group.items.map((item) => (
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

            {/* --- FOOTER GIAN HÀNG: TẠM TÍNH VÀ NÚT MUA RIÊNG CHO SHOP NÀY --- */}
            <div className="p-4 sm:px-6 bg-gray-50/60 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="text-xs sm:text-sm text-gray-600">
                Tạm tính ({selectedStoreItems.length}/{group.items.length} món đã chọn):{" "}
                <span className="font-bold text-gray-900 text-base">
                  {formatCurrency(storeSubtotal)}
                </span>
              </div>

              {onCheckoutStore && (
                <button
                  type="button"
                  onClick={() => onCheckoutStore(group.storeKey)}
                  className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all shadow-sm hover:shadow flex items-center justify-center gap-1.5 cursor-pointer self-end sm:self-auto"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Mua từ gian hàng này</span>
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
