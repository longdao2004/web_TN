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

import { storeService } from '@/services/store.service';
import { productService } from '@/services/product.service';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  try {
    const store = await storeService.getStoreById(resolvedParams.id);
    return {
      title: `${store.name} | AgriMarket`,
      description: store.description,
      openGraph: {
        title: `${store.name} | AgriMarket`,
        description: store.description,
        images: [store.banner],
      }
    };
  } catch (e) {
    return { title: 'Không tìm thấy cửa hàng' };
  }
}

export default async function StoreDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  let store: any = null;
  let products: any[] = [];
  let relatedStores: any[] = [];
  
  try {
    // Gọi API thật để lấy dữ liệu cửa hàng
    store = await storeService.getStoreById(resolvedParams.id);
    const storeProducts = await productService.getProducts({ storeId: resolvedParams.id });
    products = storeProducts.items || storeProducts;
    
    // Lấy thử vài cửa hàng khác làm related
    const allStores = await storeService.getStores();
    relatedStores = allStores.filter(s => s.id !== store.id).slice(0, 4);
  } catch (e) {
    notFound();
  }

  if (!store) {
    notFound();
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {/* Đường dẫn (Breadcrumb) */}
        <div className="py-4 sm:py-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Trang chủ </BreadcrumbLink>
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

        {/* Phần Hero (Banner) */}
        <StoreHero store={store} />
        
        <div className="mt-6 md:mt-8 grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* Left Column (Main Content) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            {/* Fallback properties that don't exist yet gracefully */}
            {store.statistics && <StoreStatistics statistics={store.statistics} />}
            
            {/* Products with Filter */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in delay-200">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-64 shrink-0">
                  <StoreFilters />
                </div>
                <div className="flex-1 w-full min-w-0">
                  <StoreProducts products={products} />
                </div>
              </div>
            </div>

            <StoreReviews store={store} reviews={[]} />
          </div>
          
          {/* Right Column (Sidebar) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            <StoreIntroduction introduction={store.description || 'Chưa có thông tin giới thiệu.'} />
            <StoreCertificates certificates={store.certificates || []} />
            <StoreLocation address={store.address} />
          </div>
          
        </div>

        <RelatedStores stores={relatedStores} />

      </PageContainer>
    </div>
  );
}
