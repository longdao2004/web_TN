"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, MapPin, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge, Button } from "@/components/ui";
import { Product } from "@/types/product";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

interface ProductCardExtendedProps {
  product: Product;
}

export const ProductCardExtended = ({ product }: ProductCardExtendedProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    try {
      await addItem(
        {
          id: product.id,
          productId: product.id,
          slug: product.slug || product.id,
          name: product.name,
          category: "Nông sản",
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          maxQuantity: 10,
          store: {
            id: "store-1",
            name: product.storeName || "Cửa hàng",
            slug: "cua-hang",
          },
        },
        1,
      );

      toast.success("Thêm vào giỏ hàng thành công", {
        description: product.name,
        action: { label: "Xem giỏ", onClick: () => router.push("/gio-hang") },
      });
    } catch (err: any) {
      if (err.message === "UNAUTHORIZED") {
        toast.error("Vui lòng đăng nhập để mua hàng");
        router.push("/dang-nhap");
      } else {
        toast.error("Không thể thêm vào giỏ hàng");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 `}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <Link
          href={
            product.isExpired ? "#" : `/san-pham/${product.slug || product.id}`
          }
          onClick={(e) => product.isExpired && e.preventDefault()}
          className="block w-full h-full relative"
        >
          <Image
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isExpired ? "blur-[2px] grayscale" : ""}`}
            loading="lazy"
            width={500}
            height={500}
          />
          {product.isExpired && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-red-600 text-white font-bold px-4 py-2 rounded shadow-lg text-sm">
                ĐÃ HẾT HẠN
              </span>
            </div>
          )}
        </Link>

        {/* 🟢 Badges Overlay: Đã tích hợp nhãn Lô mới về & Sửa lỗi số 0 */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
          {/* Huy hiệu Lô mới về */}
          {product.isNewBatch && !product.isExpired && (
            <span className="inline-flex items-center gap-1 bg-emerald-600 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-full shadow-md animate-pulse">
              🌿 Lô mới về
            </span>
          )}

          {/* Huy hiệu giảm giá (dùng toán tử 3 ngôi chống hiện số 0) */}
          {product.discount && product.discount > 0 ? (
            <Badge variant="danger" size="sm" className="font-bold">
              -{product.discount}%
            </Badge>
          ) : null}

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
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        {/* Store & Location */}
        <div className="flex items-center justify-between text-xs text-[var(--color-text-secondary)] mb-1.5">
          <Link
            href={product.isExpired ? "#" : `/cua-hang/${product.storeName}`}
            onClick={(e) => product.isExpired && e.preventDefault()}
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
        <Link
          href={
            product.isExpired ? "#" : `/san-pham/${product.slug || product.id}`
          }
          onClick={(e) => product.isExpired && e.preventDefault()}
        >
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors h-10">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          </div>
          {/* 🟢 Đồng bộ hiển thị số sao luôn có 1 chữ số thập phân (5.0 thay vì 5) */}
          <span className="text-xs font-bold text-gray-700">
            {Number(product.rating || 5).toFixed(1)}
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
                {formatPrice(product.price)}
              </span>
              <span className="text-xs text-gray-500 mb-1">
                /{product.unit}
              </span>
            </div>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-within:opacity-100">
            <Link
              href={
                product.isExpired
                  ? "#"
                  : `/san-pham/${product.slug || product.id}`
              }
              className="flex-1"
              onClick={(e) => product.isExpired && e.preventDefault()}
            >
              <Button
                className="w-full h-9 text-xs"
                variant="primary"
                disabled={product.isExpired}
              >
                Xem chi tiết
              </Button>
            </Link>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isLoading || product.isExpired}
              className={`h-7 w-7 shrink-0 rounded-lg flex items-center justify-center border transition-all duration-200 ${
                product.isExpired
                  ? "border-gray-200 bg-gray-50/50 text-gray-300 cursor-not-allowed"
                  : "border-gray-200 bg-white text-gray-500 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 active:scale-95 shadow-none"
              }`}
              title={product.isExpired ? "Sản phẩm đã hết hạn" : "Thêm vào giỏ"}
            >
              {isLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin text-emerald-600" />
              ) : (
                <ShoppingCart className="h-3.5 w-3.5 transition-colors" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};