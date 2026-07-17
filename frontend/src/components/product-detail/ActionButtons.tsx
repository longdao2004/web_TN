import React from "react";
import { ShoppingCart, Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui";

interface ActionButtonsProps {
  onAddToCart: () => void;
  onBuyNow: () => void;
  onFavorite: () => void;
  onShare: () => void;
  disabled?: boolean;
}

export const ActionButtons = ({
  onAddToCart,
  onBuyNow,
  onFavorite,
  onShare,
  disabled,
}: ActionButtonsProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <Button
        variant="outline"
        size="lg"
        className="flex-1 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]"
        onClick={onAddToCart}
        disabled={disabled}
      >
        <ShoppingCart className="mr-2 h-5 w-5" />
        Thêm vào giỏ
      </Button>

      <Button
        variant="primary"
        size="lg"
        className="flex-1"
        onClick={onBuyNow}
        disabled={disabled}
      >
        Mua ngay
      </Button>

      <div className="flex gap-3">
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 text-gray-600 hover:text-red-500 hover:border-red-200 hover:bg-red-50"
          onClick={onFavorite}
        >
          <Heart className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-12 w-12 shrink-0 text-gray-600 hover:text-[var(--color-primary)] hover:border-[var(--color-primary-light)] hover:bg-[var(--color-primary-light)]"
          onClick={onShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};
