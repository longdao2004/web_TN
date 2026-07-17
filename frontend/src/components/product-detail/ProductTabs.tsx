"use client";
import React, { useState } from "react";
import { ProductDetail } from "@/types/product-detail";
import { ReviewSection } from "./ReviewSection";
import { cn } from "@/utils/cn";

interface ProductTabsProps {
  product: ProductDetail;
}

export const ProductTabs = ({ product }: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<"desc" | "specs" | "reviews">(
    "desc",
  );

  const tabs = [
    { id: "desc", label: "Mô tả sản phẩm" },
    { id: "specs", label: "Thông số chi tiết" },
    { id: "reviews", label: `Đánh giá (${product.reviewCount})` },
  ] as const;

  return (
    <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
      {/* Tab Headers */}
      <div className="flex overflow-x-auto border-b border-[var(--color-border)] hide-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-6 py-4 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors duration-300",
              activeTab === tab.id
                ? "border-[var(--color-primary)] text-[var(--color-primary)]"
                : "border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-50",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Description */}
        <div
          className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-500",
            activeTab !== "desc" && "hidden",
          )}
        >
          <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
            {product.description.split("\n").map((paragraph, idx) => (
              <p key={idx} className="mb-4 last:mb-0 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Specifications */}
        <div
          className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-500",
            activeTab !== "specs" && "hidden",
          )}
        >
          <div className="border border-gray-100 rounded-xl overflow-hidden">
            {Object.entries(product.specifications).map(([key, value], idx) => (
              <div
                key={key}
                className={cn(
                  "flex flex-col sm:flex-row sm:items-center px-4 py-3",
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white",
                )}
              >
                <div className="sm:w-1/3 font-medium text-gray-600 text-sm mb-1 sm:mb-0">
                  {key}
                </div>
                <div className="sm:w-2/3 text-gray-900 text-sm">{value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div
          className={cn(
            "animate-in fade-in slide-in-from-bottom-2 duration-500",
            activeTab !== "reviews" && "hidden",
          )}
        >
          <ReviewSection
            reviews={product.reviews}
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>
      </div>
    </div>
  );
};
