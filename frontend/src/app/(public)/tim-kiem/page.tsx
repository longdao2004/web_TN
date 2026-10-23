import React from 'react';
import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/core';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui';

import {
  SearchHeader,
  SearchResultGrid,
  EmptySearch,
  SearchPagination
} from '@/components/search';

import { productService } from '@/services/product.service';
import { storeService } from '@/services/store.service';
import { StoreGrid } from '@/components/store-list';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  return {
    title: q ? `Kết quả tìm kiếm cho "${q}" | AgriMarket` : 'Tìm kiếm | AgriMarket',
    description: `Tìm kiếm sản phẩm và cửa hàng nông sản sạch.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : 'newest';
  const page = typeof resolvedParams.page === 'string' ? Math.max(1, parseInt(resolvedParams.page, 10) || 1) : 1;
  const ITEMS_PER_PAGE = 12; // Số sản phẩm hiển thị trên mỗi trang

  // 🟢 Xác định tiêu chí sắp xếp để gọi API
  let sortBy: string | undefined = undefined;
  let order: 'asc' | 'desc' | undefined = undefined;

  if (sort === 'bestseller') {
    sortBy = 'bestseller';
  } else if (sort === 'rating') {
    sortBy = 'rating';
  } else if (sort === 'price_asc') {
    sortBy = 'price';
    order = 'asc';
  } else if (sort === 'price_desc') {
    sortBy = 'price';
    order = 'desc';
  } else {
    sortBy = 'newest';
    order = 'desc';
  }
  
  let allProducts: any[] = [];
  let stores: any[] = [];

  try {
    const [productsData, storesData] = await Promise.all([
      productService.getProducts({ search: q, sortBy, order }).catch(() => []),
      storeService.getStores({ search: q }).catch(() => [])
    ]);
    allProducts = productsData.items || productsData;
    stores = storesData || [];
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
  }

  // 🟢 Tính toán phân trang thực tế theo dữ liệu sản phẩm
  const totalProducts = allProducts.length;
  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE);
  const paginatedProducts = allProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasProductResults = totalProducts > 0;
  const hasStoreResults = stores.length > 0;
  const hasResults = hasProductResults || hasStoreResults;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {/* Đường dẫn Breadcrumb */}
        <div className="py-4 sm:py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>Kết quả tìm kiếm</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Tiêu đề kết quả tìm kiếm (Đếm chuẩn xác số lượng sản phẩm tìm thấy) */}
        {hasResults && (
          <SearchHeader query={q} totalResults={totalProducts} />
        )}
        
        <div className="flex flex-col gap-6 lg:gap-8 items-start mt-6">
          
          {/* Nội dung kết quả tìm kiếm (Không dùng thanh lọc sidebar theo yêu cầu) */}
          <div className="flex-1 min-w-0 w-full">
            {hasResults ? (
              <>
                {/* Gian hàng / Cửa hàng liên quan (nếu có) */}
                {hasStoreResults && (
                  <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">
                      Cửa hàng liên quan ({stores.length})
                    </h2>
                    <StoreGrid stores={stores} />
                  </div>
                )}
                
                {/* Danh sách sản phẩm tìm kiếm */}
                {hasProductResults && (
                  <div>
                    {/* Tiêu đề danh sách sản phẩm tìm được */}
                    <div className="mb-6 border-b pb-4">
                      <h2 className="text-xl font-bold text-gray-900">
                        Sản phẩm liên quan ({totalProducts})
                      </h2>
                    </div>

                    {/* Lưới hiển thị các sản phẩm */}
                    <SearchResultGrid products={paginatedProducts} />

                    {/* Phân trang: Tự động ẩn khi có ít hơn 1 trang sản phẩm (ví dụ 3 món) */}
                    <SearchPagination
                      currentPage={page}
                      totalPages={totalPages}
                      query={q}
                      sort={sort}
                    />
                  </div>
                )}
              </>
            ) : (
              <EmptySearch query={q} />
            )}
          </div>
          
        </div>
        
      </PageContainer>
    </div>
  );
}
