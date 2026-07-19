import React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui";

export const EmptyCart = () => {
  return (
    <div className="bg-white rounded-3xl border border-[var(--color-border)] shadow-sm p-12 flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="w-48 h-48 mb-6 relative">
        <div className="absolute inset-0 bg-[var(--color-primary-light)] rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute inset-4 bg-[var(--color-primary-light)] rounded-full opacity-40"></div>
        <div className="absolute inset-0 flex items-center justify-center text-[var(--color-primary)]">
          <ShoppingBag className="h-20 w-20" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Giỏ hàng của bạn đang trống
      </h2>
      <p className="text-gray-500 mb-8 max-w-md mx-auto">
        Có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá hàng
        ngàn sản phẩm nông sản tươi sạch đang chờ bạn nhé!
      </p>

      <Link href="/san-pham">
        <Button size="lg" className="h-12 px-8 font-semibold rounded-xl">
          Tiếp tục mua sắm ngay
        </Button>
      </Link>
    </div>
  );
};
