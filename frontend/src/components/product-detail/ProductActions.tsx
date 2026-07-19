"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuantitySelector } from "./QuantitySelector";
import { ActionButtons } from "./ActionButtons";

interface ProductActionsProps {
  stock: number;
  productName: string;
}

export const ProductActions = ({ stock, productName }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    toast.success("Đã thêm vào giỏ hàng", {
      description: `${productName} (x${quantity})`,
      action: {
        label: "Xem giỏ hàng",
        onClick: () => router.push("/gio-hang"),
      },
      duration: 4000,
    });
  };

  const handleBuyNow = () => {
    router.push("/gio-hang");
  };

  const handleFavorite = () => {
    toast.info("Đã thêm vào danh sách yêu thích!");
  };

  const handleShare = () => {
    toast.info("Đã copy link chia sẻ!");
  };

  return (
    <div className="flex flex-col gap-6">
      <QuantitySelector
        stock={stock}
        quantity={quantity}
        onChange={setQuantity}
      />
      <ActionButtons
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onFavorite={handleFavorite}
        onShare={handleShare}
        disabled={stock === 0}
      />
    </div>
  );
};
