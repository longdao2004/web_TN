"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui";
import { useCartStore } from "@/store/useCartStore";
import Image from "next/image";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    originalPrice?: number;
    rating: number;
    reviews: number;
    store: string;
    image: string;
    badges?: string[];
    unit: string;
    isExpired?: boolean;
    isNewBatch?: boolean;
  };
  priority?: boolean;
}

export const ProductCard = ({
  product,
  priority = false,
}: ProductCardProps) => {
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
          slug: product.id,
          name: product.name,
          category: "Sản phẩm",
          image: product.image,
          price: product.price,
          originalPrice: product.originalPrice,
          quantity: 1,
          maxQuantity: 10,
          store: { id: "store-1", name: product.store, slug: product.store },
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
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <Link
          href={product.isExpired ? "#" : `/san-pham/${product.id}`}
          onClick={(e) => product.isExpired && e.preventDefault()}
          className="block w-full h-full relative"
        >
          <Image
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110 ${product.isExpired ? "blur-[2px] grayscale" : ""}`}
            width={500}
            height={500}
            priority={priority}
          />
          {product.isExpired && (
            <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="bg-red-600 text-white font-bold px-4 py-2 rounded shadow-lg text-sm">
                ĐÃ HẾT HẠN
              </span>
            </div>
          )}
        </Link>

        {/* 🟢 Badges: Tô màu xanh ngọc nổi bật cho "Lô mới về" */}
        {product.badges && product.badges.length > 0 && !product.isExpired && (
          <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
            {product.badges.map((badge, idx) => (
              <Badge
                key={idx}
                className={
                  badge === "Lô mới về"
                    ? "bg-emerald-600 text-white font-extrabold shadow-sm"
                    : badge === "Khuyến mãi" || badge.startsWith("-")
                      ? "bg-red-500 text-white font-bold"
                      : "bg-blue-600 text-white font-bold"
                }
                size="sm"
              >
                {badge === "Lô mới về" ? `🌿 ${badge}` : badge}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-4">
        <Link
          href={product.isExpired ? "#" : `/cua-hang/${product.store}`}
          onClick={(e) => product.isExpired && e.preventDefault()}
          className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:underline mb-1"
        >
          {product.store}
        </Link>

        <Link
          href={product.isExpired ? "#" : `/san-pham/${product.id}`}
          onClick={(e) => product.isExpired && e.preventDefault()}
        >
          <h3 className="text-sm font-semibold text-[var(--color-text-primary)] line-clamp-2 hover:text-[var(--color-primary)] transition-colors h-10">
            {product.name}
          </h3>
        </Link>

        <div className="mt-2 flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="text-xs font-medium text-gray-700">
            {product.rating}
          </span>
          <span className="text-xs text-gray-400">({product.reviews})</span>
        </div>

        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          {/* Cột giá tiền */}
          <div className="flex flex-col min-w-0">
            <span className="text-base sm:text-lg font-bold text-emerald-700 leading-tight truncate">
              {formatPrice(product.price)}
            </span>
            <div className="flex items-center gap-1.5 mt-0.5 text-xs text-gray-400">
              <span className="truncate">/{product.unit}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="line-through truncate">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
          </div>

          {/* Nút giỏ hàng */}
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
  );
};