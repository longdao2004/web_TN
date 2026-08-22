import React from "react";
import { Metadata } from "next";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";

import {
  StoreHero,
  StoreSearch,
  StoreFilters,
  StoreGrid,
  FeaturedStores,
  StorePagination,
} from "@/components/store-list";

import { storeService } from "@/services/store.service";

export const metadata: Metadata = {
  title: "Danh sách Cửa hàng nông sản | AgriMarket",
  description:
    "Khám phá hàng trăm cửa hàng, nhà vườn và hợp tác xã uy tín cung cấp nông sản sạch trên toàn quốc.",
  openGraph: {
    title: "Danh sách Cửa hàng nông sản | AgriMarket",
    description:
      "Khám phá hàng trăm cửa hàng, nhà vườn và hợp tác xã uy tín cung cấp nông sản sạch trên toàn quốc.",
    images: [
      "/images/products/thucan.avif",
    ],
  },
};

export default async function StoreListPage() {
  let stores: any[] = [];
  let error = null;

  try {
    stores = await storeService.getStores();
  } catch (err: any) {
    error = err.message || "Lỗi tải danh sách cửa hàng";
  }

  const featuredStores = stores.filter((s: any) => s.isFeatured);

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
                <BreadcrumbLink isCurrentPage>Cửa hàng nông sản</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Hero Section */}
        <StoreHero />

        {error ? (
          <div className="py-20 text-center text-red-500 bg-white rounded-xl shadow-sm border border-red-100 mt-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Featured Stores */}
            {featuredStores.length > 0 && <FeaturedStores stores={featuredStores} />}

            {/* Search Bar */}
            <StoreSearch />

            {/* Main Content Grid */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4">
              {/* Sidebar Filters */}
              <div className="w-full lg:w-72 shrink-0">
                <StoreFilters />
              </div>

              {/* Store Grid */}
              <div className="flex-1 min-w-0">
                <StoreGrid stores={stores} />
                <StorePagination />
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
