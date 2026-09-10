"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { QuantitySelector } from "./QuantitySelector";
import { ActionButtons } from "./ActionButtons";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/auth.store";

export const ProductActions = ({ product }: { product: Product }) => {
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { addItem, setBuyNowItem } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  const createCartItem = () => ({
    id: product.id,
    productId: product.id,
    slug: product.slug || product.id,
    name: product.name,
    category: "Sản phẩm",
    image: product.image || "",
    price: product.salePrice || product.price,
    originalPrice: product.salePrice ? product.price : undefined,
    quantity: quantity,
    maxQuantity: product.stock,
    store: {
      id: "store-1",
      name: product.storeName || "Cửa hàng",
      slug: product.storeName || "store-1",
    },
  });

  const handleAddToCart = async () => {
    // [Bảo mật] Ép buộc đăng nhập trước khi thao tác giỏ hàng
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      router.push("/dang-nhap");
      return;
    }

    try {
      await addItem(createCartItem(), quantity);
      toast.success("Thêm vào giỏ hàng thành công", {
        description: `${product.name} (x${quantity})`,
        action: {
          label: "Xem giỏ hàng",
          onClick: () => router.push("/gio-hang"),
        },
      });
    } catch (err: any) {
      toast.error("Không thể thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = () => {
  if (!isAuthenticated) {
    toast.error("Vui lòng đăng nhập để mua hàng!");
    router.push("/dang-nhap");
    return;
  }

  // Lưu sản phẩm vào luồng mua ngay độc lập (không động vào giỏ hàng)
  setBuyNowItem(createCartItem());
  router.push("/thanh-toan?type=buynow");
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
        onFavorite={() => {}} // Removed from UI
        onShare={() => {}} // Removed from UI
        disabled={product.stock === 0}
      />
    </div>
  );
};
