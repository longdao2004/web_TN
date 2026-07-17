import React from "react";
import { Star } from "lucide-react";
import { ProductDetail } from "@/types/product-detail";
import { Badge } from "@/components/ui";

interface ProductInfoProps {
  product: ProductDetail;
}

export const ProductInfo = ({ product }: ProductInfoProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Badges */}
      <div className="flex items-center gap-2 flex-wrap">
        {product.isOrganic && (
          <Badge className="bg-emerald-500 text-white font-bold" size="sm">
            Hữu cơ
          </Badge>
        )}
        {product.isFeatured && (
          <Badge variant="primary" size="sm">
            Nổi bật
          </Badge>
        )}
      </div>

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      {/* Ratings & Meta */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          <span className="font-bold text-gray-900">{product.rating}</span>
          <span className="text-gray-500">
            ({product.reviewCount} đánh giá)
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

        <div className="text-gray-500">
          Đã bán:{" "}
          <span className="font-semibold text-gray-900">
            {product.reviewCount * 3 + 120}
          </span>
        </div>

        <div className="w-px h-4 bg-gray-300 hidden sm:block"></div>

        <div className="text-gray-500">
          Mã SP:{" "}
          <span className="font-semibold text-gray-900">
            {product.id.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="mt-4 p-4 rounded-2xl bg-gray-50 flex items-end gap-3 flex-wrap">
        <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-primary)] tracking-tight">
          {formatPrice(product.salePrice || product.price)}
        </span>

        {product.salePrice && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg text-gray-400 line-through font-medium">
              {formatPrice(product.price)}
            </span>
            <Badge variant="danger" className="font-bold rounded-md">
              -{product.discount}%
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
};
