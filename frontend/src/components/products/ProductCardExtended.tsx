import React from "react";
import Link from "next/link";
import { ShoppingCart, Star, Heart, MapPin } from "lucide-react";
import { Badge, Button } from "@/components/ui";
import { Product } from "@/types/product";

interface ProductCardExtendedProps {
  product: Product;
}

export const ProductCardExtended = ({ product }: ProductCardExtendedProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link href={`/san-pham/${product.slug || product.id}`}>
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
        </Link>

        {/* Badges Overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {product.discount && product.discount > 0 && (
            <Badge variant="danger" size="sm" className="font-bold">
              -{product.discount}%
            </Badge>
          )}
          {product.isOrganic && (
            <Badge
              className="bg-emerald-500 text-white hover:bg-emerald-600 font-bold"
              size="sm"
            >
              Hữu cơ
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="primary" size="sm" className="font-bold">
              Mới
            </Badge>
          )}
        </div>

        {/* Favorite Button Overlay */}
        <button className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-gray-500 backdrop-blur-sm transition-all hover:bg-red-50 hover:text-red-500 shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100">
          <Heart className="h-4 w-4" />
        </button>
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Store & Location */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1.5">
          <Link
            href={`/store/${product.storeName}`}
            className="hover:text-[var(--color-primary)] hover:underline truncate max-w-[60%]"
          >
            {product.storeName}
          </Link>
          <div className="flex items-center gap-0.5 truncate">
            <MapPin className="h-3 w-3" />
            <span>{product.province}</span>
          </div>
        </div>

        {/* Title */}
        <Link href={`/san-pham/${product.slug || product.id}`}>
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors h-10">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </div>
          <span className="text-xs font-bold text-gray-700">
            {product.rating}
          </span>
          <span className="text-xs text-gray-400">
            ({product.reviewCount} đánh giá)
          </span>
        </div>

        {/* Price & Actions */}
        <div className="mt-4 flex flex-col justify-end flex-1 gap-3">
          <div>
            <div className="flex items-end gap-1.5 flex-wrap">
              <span className="text-lg font-bold text-[var(--color-primary)]">
                {formatPrice(product.salePrice || product.price)}
              </span>
              <span className="text-xs text-gray-500 mb-1">
                /{product.unit}
              </span>
            </div>
            {product.salePrice && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
            <Link href={`/san-pham/${product.slug || product.id}`} className="flex-1">
              <Button className="w-full h-9 text-xs" variant="primary">
                Xem chi tiết
              </Button>
            </Link>
            <Button size="icon" variant="outline" className="h-9 w-9 shrink-0">
              <ShoppingCart className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
