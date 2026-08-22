"use client";

import React, { useState, useEffect } from "react";
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
import { productService } from "@/services/product.service";

export default function ProductListPage() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getProducts();
        setProducts(data);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
          {loading ? (
            <div className="py-20 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-[var(--color-primary)] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
              </div>
              <p className="mt-4 text-gray-500">Đang tải danh sách sản phẩm...</p>
            </div>
          ) : error ? (
            <div className="py-20 text-center text-red-500">
              <p>{error}</p>
              <button onClick={() => window.location.reload()} className="mt-4 px-4 py-2 bg-[var(--color-primary)] text-white rounded-md">Thử lại</button>
            </div>
          ) : (
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
                  totalItems={products.length}
                  onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                />

                <ProductGrid products={products} />

                <div className="mt-12 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(products.length / 10) || 1}
                    onPageChange={setCurrentPage}
                  />
                </div>
              </main>
            </div>
          )}
        </PageContainer>
      </Section>
    </div>
  );
}
