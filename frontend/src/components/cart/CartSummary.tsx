import React from "react";
import { ArrowRight, ShoppingBag, Store } from "lucide-react";
import { Button } from "@/components/ui";
import { CartSummaryData } from "@/types/cart";

interface CartSummaryProps {
  data: CartSummaryData;
  onCheckout: () => void;
  onContinueShopping: () => void;
  selectedCount: number;
  selectedStoreName?: string; // Tên gian hàng đang được chọn thanh toán
}

export const CartSummary = ({
  data,
  onCheckout,
  onContinueShopping,
  selectedCount,
  selectedStoreName,
}: CartSummaryProps) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm overflow-hidden sticky top-24">
      <div className="p-5 border-b border-[var(--color-border)]">
        <h3 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h3>
        {/* Hiển thị huy hiệu cửa hàng đang chọn thanh toán */}
        {selectedStoreName && (
          <div className="mt-2.5 flex items-center gap-2 p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            <Store className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="truncate">
              Đang chọn: <strong>{selectedStoreName}</strong>
            </span>
          </div>
        )}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">
            Tạm tính ({selectedCount} sản phẩm)
          </span>
          <span className="font-medium text-gray-900">
            {formatCurrency(data.subTotal)}
          </span>
        </div>

        {data.discount > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-emerald-600">Giảm giá</span>
            <span className="font-medium text-emerald-600">
              -{formatCurrency(data.discount)}
            </span>
          </div>
        )}

        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Phí vận chuyển</span>
          <span className="font-medium text-gray-900">
            {data.shippingFee === 0
              ? "Miễn phí"
              : formatCurrency(data.shippingFee)}
          </span>
        </div>

        {data.tax > 0 && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">Thuế VAT (8%)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(data.tax)}
            </span>
          </div>
        )}

        <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
          <div className="flex justify-between items-end">
            <span className="font-bold text-gray-900">Tổng cộng</span>
            <div className="text-right">
              <span className="block text-2xl font-black text-[var(--color-primary)]">
                {formatCurrency(data.total)}
              </span>
              <span className="text-[10px] text-gray-500">
                (Đã bao gồm VAT nếu có)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-5 bg-gray-50/50 space-y-3">
        <Button
          className="w-full h-12 text-base font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all hover:-translate-y-0.5"
          onClick={onCheckout}
          disabled={selectedCount === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          {selectedStoreName ? `Thanh toán (${selectedCount} món)` : "Tiến hành thanh toán"}
        </Button>
        <Button
          variant="outline"
          className="w-full h-12 text-gray-600 border-gray-200 hover:bg-gray-100 transition-colors"
          onClick={onContinueShopping}
        >
          Tiếp tục mua sắm
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
