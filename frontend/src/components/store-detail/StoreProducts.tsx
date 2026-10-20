import React from "react";
import { ProductCard } from "@/components/home/components/ProductCard";
import { Product } from "@/types/product";

interface StoreProductsProps {
  products: Product[];
}

export const StoreProducts = ({ products }: StoreProductsProps) => {
  return (
    <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in delay-400">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Tất cả sản phẩm của cửa hàng</h2>
        <span className="text-sm text-gray-500 font-medium">
          {products.length} sản phẩm
        </span>
      </div>

      {products.length === 0 ? (
        <div className="py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100">
          Cửa hàng hiện chưa có sản phẩm nào đang mở bán.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard 
              key={product.id} 
              product={{
                id: product.id,
                name: product.name,
                // 🟢 ĐỒNG BỘ GIÁ BÁN & GIÁ GỐC GẠCH NGANG:
                price: product.price, // Giá bán thực tế
                originalPrice: product.originalPrice, // Giá gốc niêm yết (gạch ngang)
                // 🟢 ĐỒNG BỘ HUY HIỆU (LÔ MỚI VỀ & GIẢM GIÁ):
                badges: product.badges,
                isNewBatch: product.isNewBatch,
                rating: product.rating || 0,
                reviews: product.reviewCount || 0,
                store: product.storeName || "Cửa hàng",
                image: product.image || "/images/products/cachuabi.avif",
                unit: product.unit || "kg",
                isExpired: product.isExpired,
              }} 
            />
          ))}
        </div>
      )}

      {/* Phân trang */}
      {products.length > 8 && (
        <div className="flex justify-center mt-10">
          <button className="px-6 py-2.5 bg-white border border-gray-200 rounded-full text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors shadow-2xs">
            Xem thêm sản phẩm
          </button>
        </div>
      )}
    </div>
  );
};