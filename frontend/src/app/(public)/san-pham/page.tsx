"use client";

import React, { useState, useEffect, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
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

// Số lượng sản phẩm hiển thị trên mỗi trang (12 sản phẩm = lưới 4 cột x 3 hàng chuẩn đẹp)
const ITEMS_PER_PAGE = 12;

function ProductListContent() {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const filters = {
          search: searchParams.get('search') || undefined,
          categoryId: searchParams.get('category') || undefined,
          minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
          maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
          sortBy: searchParams.get('sort') || undefined,
          order: (searchParams.get('order') as 'asc' | 'desc') || undefined,
        };
        const data = await productService.getProducts(filters);

        // 🟢 [GỢI Ý 1 - SORT SINKING]: TỰ ĐỘNG ĐẨY SẢN PHẨM HẾT HẠN XUỐNG CUỐI
        // - a.isExpired = false (còn hạn) -> ưu tiên lên đầu (-1)
        // - b.isExpired = true (hết hạn) -> đẩy về sau (1)
        // - Nếu cùng trạng thái hạn -> giữ nguyên thứ tự sắp xếp theo giá / đánh giá từ backend
        const sortedData = [...data].sort((a: any, b: any) => {
          if (a.isExpired !== b.isExpired) {
            return a.isExpired ? 1 : -1;
          }
          return 0;
        });

        setProducts(sortedData);
        // Mỗi khi người dùng bấm lọc hoặc tìm kiếm thì tự động đưa về trang 1
        setCurrentPage(1);
      } catch (err: any) {
        setError(err.message || 'Lỗi tải danh sách sản phẩm');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  // 🟢 TÍNH TOÁN PHÂN TRANG: Cắt đúng 12 sản phẩm cho trang hiện tại
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return products.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [products, currentPage]);

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Banner và Breadcrumb */}
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
              {/* Lớp phủ bộ lọc trên di động */}
              {isMobileFilterOpen && (
                <div
                  className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                  onClick={() => setIsMobileFilterOpen(false)}
                />
              )}

              {/* Bộ lọc thanh bên */}
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

              {/* Khu vực nội dung chính */}
              <main className="flex-1 w-full lg:w-3/4">
                <SortBar
                  totalItems={products.length}
                  onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
                />

                {/* 🟢 Hiển thị danh sách sản phẩm của trang hiện tại */}
                <ProductGrid products={paginatedProducts} />

                {/* Thanh chuyển trang */}
                {totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </main>
            </div>
          )}
        </PageContainer>
      </Section>
    </div>
  );
}

export default function ProductListPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Đang tải...</div>}>
      <ProductListContent />
    </Suspense>
  );
}