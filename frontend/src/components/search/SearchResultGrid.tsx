import React from "react";
import { ProductCard } from "@/components/home/components/ProductCard";

import { MockProduct } from "@/mock/products";

interface SearchResultGridProps {
  products: MockProduct[];
}

export const SearchResultGrid = ({ products }: SearchResultGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
