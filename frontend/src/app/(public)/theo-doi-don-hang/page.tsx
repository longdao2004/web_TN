"use client";
import React, { useState } from "react";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";

import {
  OrderHeader,
  OrderStatusTimeline,
  ShippingInformation,
  PurchasedProducts,
  PaymentSummary,
  StoreInformation,
  ReviewSection,
  ActionButtons,
  RecommendedProducts,
} from "@/components/order-tracking";

import {
  mockTrackingOrder,
  mockTrackingTimeline,
  mockTrackingOrderDelivered,
  mockTrackingTimelineDelivered,
  mockTrackingRecommendedProducts,
} from "@/mock/order-tracking";

export default function OrderTrackingPage() {
  // Để mô phỏng trạng thái 'Đã giao' với mock data, ta dùng state
  // Trong thực tế sẽ fetch từ API
  const [isDelivered, setIsDelivered] = useState(false);

  const order = isDelivered ? mockTrackingOrderDelivered : mockTrackingOrder;
  const timeline = isDelivered
    ? mockTrackingTimelineDelivered
    : mockTrackingTimeline;

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
                <BreadcrumbLink href="/ho-so/don-hang">Đơn hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>Theo dõi đơn hàng</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Nút toggle Demo (chỉ dành cho test UI) */}
        <div className="mb-4 flex justify-end">
          <button
            onClick={() => setIsDelivered(!isDelivered)}
            className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded-full transition-colors"
          >
            Mô phỏng trạng thái: {isDelivered ? "Đã giao" : "Đang giao"}
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <OrderHeader order={order} />

          <OrderStatusTimeline steps={timeline} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column (Products, Store, Review) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PurchasedProducts products={order.products} />
              <StoreInformation store={order.store} />
              <ReviewSection status={order.status} />
            </div>

            {/* Right Column (Shipping & Payment) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ShippingInformation info={order.deliveryInfo} />
              <PaymentSummary order={order} />
            </div>
          </div>

          <ActionButtons storeSlug={order.store?.slug} />
        </div>

        <RecommendedProducts products={mockTrackingRecommendedProducts} />
      </PageContainer>
    </div>
  );
}
