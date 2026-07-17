"use client";
import React, { useState } from "react";
import { cn } from "@/utils/cn";

interface ProductGalleryProps {
  images: string[];
  productName: string;
}

export const ProductGallery = ({
  images,
  productName,
}: ProductGalleryProps) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-[var(--color-border)] bg-gray-50 cursor-crosshair group">
        <img
          src={images[activeIndex]}
          alt={`${productName} - Image ${activeIndex + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Simple hover zoom effect is handled via CSS scale. For a real magnifying glass, we'd need more JS logic */}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              className={cn(
                "relative aspect-square overflow-hidden rounded-xl border-2 transition-all",
                activeIndex === idx
                  ? "border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/20"
                  : "border-transparent hover:border-gray-200",
              )}
            >
              <img
                src={img}
                alt={`${productName} - Thumbnail ${idx + 1}`}
                className="h-full w-full object-cover"
              />
              {activeIndex !== idx && (
                <div className="absolute inset-0 bg-white/40 hover:bg-transparent transition-colors" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
