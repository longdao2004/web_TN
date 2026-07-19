import React from "react";
import { Receipt } from "lucide-react";

interface OrderSummaryProps {
  subTotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  subTotal,
  discount,
  shippingFee,
  tax,
  total,
}) => {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5 text-emerald-500" />
        Tóm tắt đơn hàng
      </h3>

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-gray-600">
          <span>Tạm tính</span>
          <span className="font-medium text-gray-900">
            {formatCurrency(subTotal)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-600">
            <span>Giảm giá</span>
            <span className="font-medium">-{formatCurrency(discount)}</span>
          </div>
        )}

        <div className="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span className="font-medium text-gray-900">
            {shippingFee === 0 ? "Miễn phí" : formatCurrency(shippingFee)}
          </span>
        </div>

        {tax > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Thuế (VAT 8%)</span>
            <span className="font-medium text-gray-900">
              {formatCurrency(tax)}
            </span>
          </div>
        )}

        <div className="pt-4 mt-4 border-t border-gray-100 flex justify-between items-end">
          <span className="text-gray-900 font-bold">Tổng thanh toán</span>
          <div className="text-right">
            <span className="block text-2xl font-black text-emerald-600">
              {formatCurrency(total)}
            </span>
            <span className="text-xs text-gray-500 mt-1 block">
              (Đã bao gồm VAT nếu có)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
