"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuantitySelector } from "./QuantitySelector";
import { ActionButtons } from "./ActionButtons";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";

export const ProductActions = ({ product }: { product: any }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem, setBuyNowItem } = useCartStore();

  const createCartItem = () => ({
    id: product.id,
    productId: product.id,
    slug: product.slug || product.id,
    name: product.name,
    category: 'Sản phẩm',
    image: product.images ? product.images[0] : product.image || '',
    price: product.salePrice || product.price,
    originalPrice: product.salePrice ? product.price : undefined,
    quantity: quantity,
    maxQuantity: product.stock,
    store: { 
      id: 'store-1', 
      name: product.store?.name || product.storeName || 'Cửa hàng', 
      slug: product.store?.name || product.storeName || 'store-1' 
    },
  });

  const handleAddToCart = () => {
    const isUpdated = addItem(createCartItem(), quantity);
    toast.success(isUpdated ? "Đã tăng số lượng trong giỏ hàng" : "Đã thêm vào giỏ hàng", {
      description: `${product.name} (x${quantity})`,
      action: {
        label: "Xem giỏ hàng",
        onClick: () => router.push("/gio-hang"),
      },
      duration: 4000,
    });
  };

  const handleBuyNow = () => {
    setBuyNowItem(createCartItem());
    toast("⚡ Đang chuyển đến trang thanh toán...", {
      duration: 1000,
      className: "animate-in fade-in slide-in-from-bottom-4"
    });
    // Add small delay for toast to show
    setTimeout(() => {
      router.push("/thanh-toan?type=buynow");
    }, 300);
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
        stock={product.stock}
        quantity={quantity}
        onChange={setQuantity}
      />
      <ActionButtons
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onFavorite={handleFavorite}
        onShare={handleShare}
        disabled={product.stock === 0}
      />
    </div>
  );
};
