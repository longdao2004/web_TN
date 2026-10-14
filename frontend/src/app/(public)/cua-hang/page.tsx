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
  StoreSearch,
  StoreGrid,
  FeaturedStores,
  StorePagination,
  RegisterStoreBanner,
} from "@/components/store-list";

import { storeService } from "@/services/store.service";

export const metadata: Metadata = {
  title: "Danh sách Cửa hàng nông sản | AgriMarket",
  description:
    "Khám phá các nhà vườn, trang trại và hợp tác xã uy tín cung cấp nông sản sạch trên toàn quốc.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function StoreListPage({ searchParams }: Props) {
  let stores: any[] = [];
  let error = null;

  const resolvedParams = await searchParams;
  const search = typeof resolvedParams.search === "string" ? resolvedParams.search : undefined;

  try {
    stores = await storeService.getStores({ search });
  } catch (err: any) {
    error = err.message || "Lỗi tải danh sách cửa hàng";
  }

  const featuredStores = stores.filter((s: any) => s.isFeatured);

  // Phân trang
  const page = typeof resolvedParams.page === "string" ? Number(resolvedParams.page) : 1;
  const itemsPerPage = 8;
  const totalItems = stores.length;
  const paginatedStores = stores.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <div className="bg-gray-50/50 min-h-screen pb-16 overflow-x-hidden">
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
                <BreadcrumbLink isCurrentPage>Cửa hàng nông sản</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* DUY NHẤT 1 BANNER MỚI TUYỆT ĐẸP Ở ĐẦU TRANG */}
        <RegisterStoreBanner />

        {error ? (
          <div className="py-20 text-center text-red-500 bg-white rounded-xl shadow-sm border border-red-100 mt-6">
            <p>{error}</p>
          </div>
        ) : (
          <>
            {/* Cửa hàng nổi bật (nếu có) */}
            {featuredStores.length > 0 && <FeaturedStores stores={featuredStores} />}

            {/* Thanh tìm kiếm tên cửa hàng */}
            

            {/* Danh sách Cửa hàng Full-width */}
            <div>
              <StoreGrid stores={paginatedStores} />
              <div className="mt-8">
                <StorePagination totalItems={totalItems} itemsPerPage={itemsPerPage} />
              </div>
            </div>
          </>
        )}
      </PageContainer>
    </div>
  );
}