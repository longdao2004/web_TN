"use client";
import React from "react";
import { ProductCardExtended } from "@/components/products/ProductCardExtended";
import { Product } from "@/types/product";

interface ProductCardProps {
  product: any;
  priority?: boolean;
}

export const ProductCard = ({
  product,
  priority = false,
}: ProductCardProps) => {
  // 🟢 Chuẩn hóa dữ liệu để đồng bộ 100% giao diện giữa Trang chủ, Trang sản phẩm và Trang tìm kiếm
  const normalizedProduct: Product = {
    id: product.id,
    slug: product.slug || product.id,
    name: product.name,
    image: product.image || product.imageUrl || "/images/products/cachuabi.avif",
    price: product.price,
    salePrice: product.salePrice,
    originalPrice: product.originalPrice,
    discount:
      product.discount !== undefined
        ? product.discount
        : product.originalPrice && product.originalPrice > product.price
          ? Math.round(
              ((product.originalPrice - product.price) / product.originalPrice) *
                100,
            )
          : undefined,
    rating: product.rating !== undefined ? product.rating : 5,
    reviewCount:
      product.reviewCount !== undefined
        ? product.reviewCount
        : product.reviews !== undefined
          ? product.reviews
          : 0,
    storeName: product.storeName || product.store || "Cửa hàng",
    province: product.province || product.origin || "Việt Nam",
    category: product.category || "Nông sản",
    stock: product.stock !== undefined ? product.stock : 10,
    isExpired: product.isExpired,
    isOrganic: product.isOrganic !== undefined ? product.isOrganic : true,
    isFeatured: product.isFeatured !== undefined ? product.isFeatured : false,
    isNew: product.isNew !== undefined ? product.isNew : true,
    unit: product.unit || "kg",
    isNewBatch: product.isNewBatch,
    badges: product.badges,
    soldCount: product.soldCount || 0,
  };

  return <ProductCardExtended product={normalizedProduct} priority={priority} />;
};
