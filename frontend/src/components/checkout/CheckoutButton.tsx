import React from "react";
import { Button } from "@/components/ui";
import { Loader2, ArrowRight } from "lucide-react";

interface CheckoutButtonProps {
  isLoading: boolean;
  onClick: () => void;
  disabled?: boolean;
}

export const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  isLoading,
  onClick,
  disabled,
}) => {
  return (
    <Button
      className="w-full h-14 text-lg font-bold rounded-xl shadow-emerald-500/25 shadow-lg group relative overflow-hidden"
      onClick={onClick}
      disabled={isLoading || disabled}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          Đang xử lý...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2 relative z-10 w-full transition-transform group-hover:translate-x-1">
          ĐẶT HÀNG
          <ArrowRight className="h-5 w-5" />
        </span>
      )}

      {/* Shine effect */}
      <span className="absolute top-0 left-0 -translate-x-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:animate-shine"></span>
    </Button>
  );
};
