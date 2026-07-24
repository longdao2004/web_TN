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

import { mockStores } from "@/mock/stores";

export const metadata: Metadata = {
  title: "Danh sách Cửa hàng nông sản | AgriMarket",
  description:
    "Khám phá hàng trăm cửa hàng, nhà vườn và hợp tác xã uy tín cung cấp nông sản sạch trên toàn quốc.",
  openGraph: {
    title: "Danh sách Cửa hàng nông sản | AgriMarket",
    description:
      "Khám phá hàng trăm cửa hàng, nhà vườn và hợp tác xã uy tín cung cấp nông sản sạch trên toàn quốc.",
    images: [
      "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    ],
  },
};

export default function StoreListPage() {
  const featuredStores = mockStores.filter((s) => s.isFeatured);

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

        {/* Featured Stores */}
        <FeaturedStores stores={featuredStores} />

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
            <StoreGrid stores={mockStores} />
            <StorePagination />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
