import React from "react";
import { ProductCard } from "@/components/home/components/ProductCard";
import { Product } from "@/types/product";

interface SearchResultGridProps {
  products: Product[];
}

export const SearchResultGrid = ({ products }: SearchResultGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
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
  );
};
