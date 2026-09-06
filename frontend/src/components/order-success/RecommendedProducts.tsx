"use client";
import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/home/components/ProductCard";
import { Product } from "@/types/product";
import { productService } from "@/services/product.service";
import { Skeleton } from "@/components/ui";

export const RecommendedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await productService.getProducts({});
        setProducts(Array.isArray(res) ? res.slice(0, 4) : []);
      } catch (error) {
        console.error("Failed to fetch recommended products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="mt-16 sm:mt-24 mb-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-64 w-full rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-16 sm:mt-24 mb-10 animate-in slide-in-from-bottom-12 duration-1000 fade-in delay-300 fill-mode-both">
      <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
        <h2 className="text-xl sm:text-2xl font-black text-gray-900 text-center">
          Có thể bạn cũng thích
        </h2>
        <div className="h-px bg-gray-200 flex-1 max-w-[100px]"></div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard 
            key={product.id} 
            product={{
              id: product.id,
              name: product.name,
              price: product.salePrice || product.price,
              originalPrice: product.salePrice ? product.price : undefined,
              rating: product.rating || 0,
              reviews: product.reviewCount || 0,
              store: product.storeName || "Cửa hàng",
              image: product.image || "/images/products/cachuabi.avif",
              unit: product.unit || "kg"
            }} 
          />
        ))}
      </div>
    </div>
  );
};
