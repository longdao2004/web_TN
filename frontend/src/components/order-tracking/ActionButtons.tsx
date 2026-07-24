import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui";
import { ShoppingBag, MessageCircle, Store } from "lucide-react";
import { toast } from "sonner";

interface ActionButtonsProps {
  storeSlug?: string;
}

export const ActionButtons = ({ storeSlug }: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6 sm:mt-8 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-400 fill-mode-both">
      {storeSlug && (
        <Link href={`/cua-hang/${storeSlug}`} className="flex-1">
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl bg-white border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold"
          >
            <Store className="w-4 h-4 mr-2" />
            Xem cửa hàng
          </Button>
        </Link>
      )}

      <Button
        variant="outline"
        className="flex-1 h-12 rounded-xl bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100 font-semibold"
        onClick={() => toast.info("Tính năng Chat đang được phát triển")}
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Liên hệ cửa hàng
      </Button>

      <Link href="/san-pham" className="flex-1">
        <Button
          variant="primary"
          className="w-full h-12 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:-translate-y-0.5 transition-transform"
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Tiếp tục mua sắm
        </Button>
      </Link>
    </div>
  );
};
