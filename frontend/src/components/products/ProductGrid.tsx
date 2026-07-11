import React from "react";
import { Product } from "@/types/product";
import { ProductCardExtended } from "./ProductCardExtended";
import { EmptyState, Button } from "@/components/ui";

interface ProductGridProps {
  products: Product[];
}

export const ProductGrid = ({ products }: ProductGridProps) => {
  if (!products || products.length === 0) {
    return (
      <div className="pt-8">
        <EmptyState
          title="Không tìm thấy sản phẩm nào"
          description="Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với bộ lọc của bạn. Hãy thử xóa bớt bộ lọc."
          action={
            <Button onClick={() => console.log("Clear filters")}>
              Xóa bộ lọc
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCardExtended key={product.id} product={product} />
      ))}
    </div>
  );
};
