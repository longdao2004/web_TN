"use client";
import React, { useState } from "react";
import { Ticket, ArrowRight, CheckCircle2 } from "lucide-react";
import { Voucher } from "@/types/cart";
import { Button } from "@/components/ui";
import { mockVouchers } from "@/mock/cart";

interface VoucherBoxProps {
  onApplyVoucher: (voucher: Voucher | null) => void;
  appliedVoucher: Voucher | null;
}

export const VoucherBox = ({
  onApplyVoucher,
  appliedVoucher,
}: VoucherBoxProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");

  const handleApply = () => {
    if (!code.trim()) return;

    const found = mockVouchers.find(
      (v) => v.code.toUpperCase() === code.trim().toUpperCase(),
    );
    if (found) {
      onApplyVoucher(found);
      setError("");
    } else {
      setError("Mã giảm giá không hợp lệ hoặc đã hết hạn.");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(val);
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[var(--color-border)] shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <Ticket className="h-5 w-5 text-[var(--color-primary)]" />
        <h3 className="font-bold text-gray-900">Mã khuyến mãi</h3>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Nhập mã giảm giá..."
            className="w-full h-11 px-4 rounded-xl border border-gray-300 focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] outline-none transition-all uppercase text-sm"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
        </div>
        <Button
          className="h-11 px-6 rounded-xl shrink-0"
          onClick={handleApply}
          disabled={!code.trim()}
        >
          Áp dụng
        </Button>
      </div>

      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}

      {appliedVoucher && (
        <div className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-medium text-emerald-700">
              Đã áp dụng: {appliedVoucher.code}
            </span>
          </div>
          <button
            onClick={() => {
              onApplyVoucher(null);
              setCode("");
            }}
            className="text-xs text-emerald-600 hover:underline"
          >
            Bỏ chọn
          </button>
        </div>
      )}

      {/* Suggested Vouchers */}
      {!appliedVoucher && (
        <div className="mt-5 space-y-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Mã có thể áp dụng
          </p>
          {mockVouchers.slice(0, 2).map((voucher) => (
            <div
              key={voucher.id}
              className="relative overflow-hidden border border-amber-200 bg-amber-50 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shrink-0 shadow-sm border border-amber-100 text-amber-500">
                <Ticket className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900">
                    {voucher.code}
                  </span>
                  <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded">
                    {voucher.discountType === "fixed"
                      ? `-${formatCurrency(voucher.discountValue)}`
                      : `-${voucher.discountValue}%`}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">
                  {voucher.description}
                </p>
              </div>
              <button
                onClick={() => {
                  setCode(voucher.code);
                  onApplyVoucher(voucher);
                }}
                className="shrink-0 text-[var(--color-primary)] hover:bg-amber-100 p-2 rounded-full transition-colors"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
