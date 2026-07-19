import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";
import { CartItem } from "@/types/cart";

interface OrderItemsProps {
  items: CartItem[];
}

export const OrderItems: React.FC<OrderItemsProps> = ({ items }) => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Package className="h-5 w-5 text-emerald-500" />
        Sản phẩm ({items.length})
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 items-center group">
            <Link
              href={`/san-pham/${item.slug}`}
              className="relative h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden border border-gray-100 group-hover:border-emerald-300 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
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
  );
};
