import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageContainer } from '@/components/layout/core';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui';

import {
  StoreHero,
  StoreStatistics,
  StoreCertificates,
  StoreIntroduction,
  StoreFilters,
  StoreProducts,
  StoreLocation,
  StoreReviews,
  RelatedStores
} from '@/components/store-detail';

import { getMockStoreDetail } from '@/mock/store-detail';

// Mock generate metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  let store = getMockStoreDetail(resolvedParams.slug);
  if (!store) {
    store = getMockStoreDetail('store-1');
  }
  if (!store) {
    return { title: 'Không tìm thấy cửa hàng' };
  }

  return {
    title: `${store.name} | AgriMarket`,
    description: store.description,
    openGraph: {
      title: `${store.name} | AgriMarket`,
      description: store.description,
      images: [store.banner],
    }
  };
}

export default async function StoreDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let store = getMockStoreDetail(resolvedParams.slug);
  
  // Fake 404 fallback to a default mock store so it doesn't break
  if (!store) {
    store = getMockStoreDetail('store-1');
  }
  
  if (!store) {
    notFound();
  }

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
                <BreadcrumbLink href="/cua-hang">Cửa hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>{store.name}</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <StoreHero store={store} />
        
        <div className="mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            <StoreStatistics statistics={store.statistics} />
            
            {/* Products with Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-200">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 shrink-0">
                  <StoreFilters />
                </div>
                <div className="flex-1 w-full min-w-0">
                  <StoreProducts products={store.products} />
                </div>
              </div>
            </div>

            <StoreReviews store={store} reviews={store.reviews} />
          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <StoreIntroduction introduction={store.introduction} />
            <StoreCertificates certificates={store.certificates} />
            <StoreLocation address={store.address} />
          </div>
          
        </div>

        <RelatedStores stores={store.relatedStores} />

      </PageContainer>
    </div>
  );
}
