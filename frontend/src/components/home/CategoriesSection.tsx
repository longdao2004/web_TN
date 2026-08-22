"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PageContainer, Section } from "@/components/layout/core";
import { categoryService } from "@/services/category.service";
import Image from "next/image";

export const CategoriesSection = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    categoryService.getAllCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <Section>
      <PageContainer>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row mb-10">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Danh mục nổi bật
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Khám phá đa dạng các loại nông sản tươi ngon
            </p>
          </div>
          <Link
            href="/san-pham"
            className="text-sm font-medium text-[var(--color-primary)] hover:underline"
          >
            Xem tất cả danh mục &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {categories.slice(0, 6).map((category, idx) => (
            <Link
              key={category.id}
              href={`/san-pham?category=${category.id}`}
              className="group relative flex flex-col items-center gap-3 overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 text-center transition-all hover:border-[var(--color-primary-light)] hover:shadow-md"
            >
              <div className="relative h-20 w-20 overflow-hidden rounded-full">
                <Image
                  src={`https://picsum.photos/seed/${category.id}/200/200`} // Mock image since backend doesn't provide category images
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  width={200}
                  height={200}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-[var(--color-primary)] transition-colors">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
