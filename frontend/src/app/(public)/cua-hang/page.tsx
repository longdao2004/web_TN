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

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StoreListPage({ searchParams }: Props) {
  let stores: any[] = [];
  let error = null;

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === 'string' ? resolvedParams.search : undefined;
  const province = typeof resolvedParams.province === 'string' ? resolvedParams.province : undefined;
  const sort = typeof resolvedParams.sort === 'string' ? resolvedParams.sort : undefined;

  try {
    stores = await storeService.getStores({ search, province, sort });
  } catch (err: any) {
    error = err.message || "Lỗi tải danh sách cửa hàng";
  }

  const featuredStores = stores.filter((s: any) => s.isFeatured);

  // Phân trang ở Client side dựa vào searchParams
  const page = typeof resolvedParams.page === 'string' ? Number(resolvedParams.page) : 1;
  const itemsPerPage = 8;
  const totalItems = stores.length;
  
  // Cắt mảng stores theo trang hiện tại
  const paginatedStores = stores.slice((page - 1) * itemsPerPage, page * itemsPerPage);

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
                <BreadcrumbLink isCurrentPage>Cửa hàng nông sản</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Phần Hero (Banner) */}
        <StoreHero />

        {error ? (
          <div className="py-20 text-center text-red-500 bg-white rounded-xl shadow-sm border border-red-100 mt-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Cửa hàng nổi bật */}
            {featuredStores.length > 0 && <FeaturedStores stores={featuredStores} />}

            {/* Thanh tìm kiếm */}
            <StoreSearch />

            {/* Lưới nội dung chính */}
            <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 mt-4">
              {/* Thanh bên Bộ lọc */}
              <div className="w-full lg:w-72 shrink-0">
                <StoreFilters />
              </div>

              {/* Lưới Cửa hàng */}
              <div className="flex-1 min-w-0">
                <StoreGrid stores={paginatedStores} />
                <StorePagination totalItems={totalItems} itemsPerPage={itemsPerPage} />
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}
