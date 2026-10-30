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
  const { isAuthenticated, user } = useAuthStore();

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
      id: (product as any).store?.id || (product as any).storeId || "store-1",
      name: product.storeName || (product as any).store?.name || "Cửa hàng",
      slug: (product as any).store?.id || (product as any).storeId || "cua-hang",
    },
  });

  const handleAddToCart = async () => {
    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      router.push("/dang-nhap");
      return;
    }

    // 2. Chặn Quản trị viên mua hàng
    if (user?.role === "ADMIN") {
      toast.warning("Tài khoản Quản trị viên chỉ có chức năng quản lý hệ thống, không thể đặt mua hàng!");
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
      toast.error(err?.message || "Không thể thêm vào giỏ hàng");
    }
  };

  const handleBuyNow = () => {
    // 1. Kiểm tra đăng nhập
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để mua hàng!");
      router.push("/dang-nhap");
      return;
    }

    // 2. Chặn Quản trị viên mua hàng
    if (user?.role === "ADMIN") {
      toast.warning("Tài khoản Quản trị viên chỉ có chức năng quản lý hệ thống, không thể đặt mua hàng!");
      return;
    }

    // Lưu sản phẩm vào luồng mua ngay độc lập
    setBuyNowItem(createCartItem());
    router.push("/thanh-toan?type=buynow");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Bộ chọn số lượng chuẩn của dự án */}
      <QuantitySelector
        stock={product.stock}
        quantity={quantity}
        onChange={setQuantity}
        disabled={product.stock === 0 || product.isExpired}
        isExpired={product.isExpired}
      />
      {/* Các nút hành động chuẩn của dự án */}
      <ActionButtons
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onFavorite={() => {}}
        onShare={() => {}}
        disabled={product.stock === 0 || product.isExpired}
        isExpired={product.isExpired}
      />
    </div>
  );
};