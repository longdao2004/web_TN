import React from "react";
import { ProductCardExtended } from "@/components/products/ProductCardExtended";
import { Product } from "@/types/product";

interface SearchResultGridProps {
  products: Product[];
}

export const SearchResultGrid = ({ products }: SearchResultGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        // 🟢 Sử dụng ProductCardExtended đồng bộ 100% với Trang sản phẩm (/san-pham)
        <ProductCardExtended key={product.id} product={product} />
      ))}
    </div>
  );
};
