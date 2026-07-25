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

import { searchProducts } from '@/mock/search';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  return {
    title: q ? `Kết quả tìm kiếm cho "${q}" | AgriMarket` : 'Tìm kiếm nông sản | AgriMarket',
    description: `Tìm kiếm và mua sắm các loại nông sản tươi ngon, sạch và an toàn.`,
  };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams;
  const q = typeof resolvedParams.q === 'string' ? resolvedParams.q : '';
  
  const results = searchProducts(q);
  const hasResults = results.length > 0;

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {/* Breadcrumb */}
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
          <SearchHeader query={q} totalResults={results.length} />
        )}
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          
          {/* Sidebar Filters */}
          {hasResults && (
            <div className="hidden lg:block w-72 shrink-0">
              <SearchSidebar />
            </div>
          )}
          
          {/* Main Content */}
          <div className="flex-1 min-w-0 w-full">
            {hasResults ? (
              <>
                {/* Mobile Filter Toggle (can add later if needed) */}
                <div className="lg:hidden mb-4">
                  {/* Placeholder for mobile filter button */}
                </div>
                
                <SearchToolbar />
                <SearchResultGrid products={results} />
                <SearchPagination />
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
