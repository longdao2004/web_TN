import React from "react";
import Link from "next/link";
import { Store as StoreIcon, Star, Package, MessageCircle } from "lucide-react";
import { Store } from "@/types/product-detail";
import { Button, Avatar } from "@/components/ui";

interface StoreInformationProps {
  store: Store;
}

export const StoreInformation = ({ store }: StoreInformationProps) => {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 flex flex-col sm:flex-row items-center gap-6">
      {/* Logo & Name */}
      <div className="flex items-center gap-4 w-full sm:w-1/3 shrink-0">
        <Avatar src={store.logo} fallback={store.name.charAt(0)} size="lg" />
        <div>
          <h3 className="font-bold text-gray-900">{store.name}</h3>
          <div className="text-xs text-gray-500 mt-1 line-clamp-1">
            {store.address}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between sm:justify-around w-full sm:flex-1 border-y sm:border-y-0 sm:border-l border-[var(--color-border)] py-4 sm:py-0 sm:pl-6 gap-2">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {store.rating}
          </div>
          <span className="text-xs text-gray-500">Đánh giá</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-[var(--color-primary)]">
            <Package className="h-4 w-4" />
            {store.productCount}
          </div>
          <span className="text-xs text-gray-500">Sản phẩm</span>
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            <MessageCircle className="h-4 w-4 text-emerald-500" />
            {store.responseRate}%
          </div>
          <span className="text-xs text-gray-500">Phản hồi</span>
        </div>
      </div>

      {/* Action */}
      <div className="w-full sm:w-auto shrink-0 flex justify-center">
        <Link href={`/cua-hang/${store.id}`}>
          <Button
            variant="outline"
            className="w-full sm:w-auto border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
          >
            <StoreIcon className="mr-2 h-4 w-4" />
            Xem cửa hàng
          </Button>
        </Link>
      </div>
    </div>
  );
};
