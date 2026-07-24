import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ShoppingBag, FileText, Home } from "lucide-react";

export const ActionButtons = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 animate-in slide-in-from-bottom-10 duration-700 fade-in delay-150 fill-mode-both">
      <Link href="/" className="flex-1">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold h-14"
        >
          <Home className="w-5 h-5 mr-2" />
          Trang chủ
        </Button>
      </Link>

      <Link href="/theo-doi-don-hang" className="flex-1">
        <Button
          variant="outline"
          size="lg"
          className="w-full rounded-xl bg-emerald-50 border-emerald-100 hover:bg-emerald-100 text-emerald-700 font-semibold h-14"
        >
          <FileText className="w-5 h-5 mr-2" />
          Xem đơn hàng
        </Button>
      </Link>

      <Link href="/san-pham" className="flex-1">
        <Button
          variant="primary"
          size="lg"
          className="w-full rounded-xl font-bold h-14 shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
        >
          <ShoppingBag className="w-5 h-5 mr-2" />
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
};
