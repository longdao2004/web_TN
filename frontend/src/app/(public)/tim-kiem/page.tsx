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
  SearchToolbar,
  SearchSidebar,
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
    description: `Tìm kiếm sản phẩm và cửa hàng.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  let products: any[] = [];
  let stores: any[] = [];

  try {
    const [productsData, storesData] = await Promise.all([
      productService.getProducts({ search: q }).catch(() => []),
      storeService.getStores({ search: q }).catch(() => [])
    ]);
    products = productsData.items || productsData;
    stores = storesData || [];
  } catch (error) {
    console.error('Lỗi khi tìm kiếm:', error);
  }

  const hasProductResults = products.length > 0;
  const hasStoreResults = stores.length > 0;
  const hasResults = hasProductResults || hasStoreResults;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {/* Đường dẫn (Breadcrumb) */}
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

        {hasResults && (
          <SearchHeader query={q} totalResults={products.length + stores.length} />
        )}
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start mt-6">
          
          {/* Nội dung chính */}
          <div className="flex-1 min-w-0 w-full">
            {hasResults ? (
              <>
                {hasStoreResults && (
                  <div className="mb-10">
                    <h2 className="text-xl font-bold mb-4 text-gray-900 border-b pb-2">Cửa hàng liên quan ({stores.length})</h2>
                    <StoreGrid stores={stores} />
                  </div>
                )}
                
                {hasProductResults && (
                  <div>
                    <div className="flex justify-between items-center mb-4 border-b pb-2">
                      <h2 className="text-xl font-bold text-gray-900">Sản phẩm liên quan ({products.length})</h2>
                      <SearchToolbar />
                    </div>
                    <SearchResultGrid products={products} />
                    <SearchPagination />
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
