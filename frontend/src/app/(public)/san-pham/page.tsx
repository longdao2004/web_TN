"use client";

import React, { useState } from "react";
import { PageContainer, Section } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Pagination,
} from "@/components/ui";
import { FilterSidebar, SortBar, ProductGrid } from "@/components/products";
import { mockProductsList } from "@/mock/product-list";

export default function ProductListPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner & Breadcrumb */}
      <div className="bg-white border-b border-[var(--color-border)] pt-8 pb-8">
        <PageContainer>
          <Breadcrumb className="mb-6">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/san-pham" isCurrentPage>
                  Sản phẩm
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Tất cả nông sản
          </h1>
          <p className="mt-3 text-lg text-gray-500 max-w-2xl">
            Khám phá nguồn nông sản tươi sạch, chất lượng cao từ các nông trại
            chuẩn VietGAP trên toàn quốc.
          </p>
        </PageContainer>
      </div>

      <Section className="py-8">
        <PageContainer>
          <div className="flex flex-col lg:flex-row gap-8 items-start relative">
            {/* Mobile Filter Overlay */}
            {isMobileFilterOpen && (
              <div
                className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                onClick={() => setIsMobileFilterOpen(false)}
              />
            )}

            {/* Sidebar Filter */}
            <aside
              className={`
                fixed inset-y-0 left-0 z-50 w-4/5 max-w-sm bg-white p-6 overflow-y-auto transition-transform duration-300 shadow-2xl lg:shadow-none
                lg:static lg:block lg:w-1/4 lg:max-w-[280px] lg:bg-transparent lg:p-0 lg:translate-x-0
                ${isMobileFilterOpen ? "translate-x-0" : "-translate-x-full"}
              `}
            >
              <FilterSidebar
                onCloseMobile={() => setIsMobileFilterOpen(false)}
              />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 w-full lg:w-3/4">
              <SortBar
                totalItems={mockProductsList.length}
                onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
              />

              <ProductGrid products={mockProductsList} />

              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={currentPage}
                  totalPages={10}
                  onPageChange={setCurrentPage}
                />
              </div>
            </main>
          </div>
        </PageContainer>
      </Section>
    </div>
  );
}
