import React, { useMemo } from "react";
import Link from "next/link";
import { Package, Store } from "lucide-react";
import { CartItem } from "@/types/cart";
import Image from "next/image";

interface OrderItemsProps {
  items: CartItem[];
}

export const OrderItems: React.FC<OrderItemsProps> = ({ items }) => {
  // 🟢 Gom nhóm các sản phẩm theo từng gian hàng để người mua dễ theo dõi
  const storeGroups = useMemo(() => {
    const groups: Record<string, { storeName: string; items: CartItem[] }> = {};
    for (const item of items) {
      const storeKey = item.store?.id || item.store?.name || "gian-hang";
      const storeName = item.store?.name || "Gian hàng Nông sản";
      if (!groups[storeKey]) {
        groups[storeKey] = { storeName, items: [] };
      }
      groups[storeKey].items.push(item);
    }
    return Object.values(groups);
  }, [items]);

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-5">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5 text-emerald-500" />
          Sản phẩm ({items.length})
        </h3>
        {storeGroups.length > 1 && (
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            {storeGroups.length} gian hàng
          </span>
        )}
      </div>

      <div className="space-y-5">
        {storeGroups.map((group, idx) => (
          <div key={idx} className="space-y-3">
            {/* Tiêu đề từng gian hàng nếu đơn hàng có nhiều gian hàng */}
            {storeGroups.length > 1 && (
              <div className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50/80 px-3 py-1.5 rounded-lg border border-gray-100">
                <Store className="w-3.5 h-3.5 text-emerald-600" />
                <span>{group.storeName}</span>
                <span className="text-gray-400 font-normal">({group.items.length} món)</span>
              </div>
            )}

            <div className="space-y-3">
              {group.items.map((item) => (
                <div key={item.id} className="flex gap-4 items-center group">
                  <Link
                    href={`/san-pham/${item.slug}`}
                    className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 group-hover:border-emerald-300 transition-colors"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      width={500}
                      height={500}
                    />
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                      {item.quantity}
                    </span>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link href={`/san-pham/${item.slug}`}>
                      <h4 className="text-sm font-semibold text-gray-800 truncate group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-gray-500 mt-0.5">{item.category}</p>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">
                      {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
