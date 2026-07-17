import React from "react";
import { Product } from "@/types/product";
import { ProductCardExtended } from "@/components/products/ProductCardExtended";

interface RelatedProductsProps {
  products: Product[];
}

export const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold tracking-tight text-gray-900 mb-6">
        Sản phẩm tương tự
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCardExtended key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
