"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { QuantitySelector } from "./QuantitySelector";
import { ActionButtons } from "./ActionButtons";

interface ProductActionsProps {
  stock: number;
}

export const ProductActions = ({ stock }: ProductActionsProps) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  const handleAddToCart = () => {
    alert("Đã thêm vào giỏ hàng");
  };

  const handleBuyNow = () => {
    router.push("/gio-hang");
  };

  const handleFavorite = () => {
    alert("Đã thêm vào danh sách yêu thích!");
  };

  const handleShare = () => {
    alert("Đã copy link chia sẻ!");
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
