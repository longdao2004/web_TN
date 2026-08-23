"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
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
  mockTrackingTimeline,
  mockTrackingTimelineDelivered,
  mockTrackingRecommendedProducts,
} from "@/mock/order-tracking";
import { orderService } from "@/services/order.service";
import { toast } from "sonner";

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params.id as string;
  
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const history = await orderService.getOrderHistory();
        const foundOrder = history.find((o: any) => o.id === id);
        
        if (foundOrder) {
          // Ánh xạ dữ liệu BE về định dạng FE cần (vì BE chưa trả đầy đủ)
          setOrder({
            ...foundOrder,
            id: foundOrder.id,
            status: foundOrder.status,
            createdAt: foundOrder.createdAt,
            totalAmount: foundOrder.totalAmount,
            products: foundOrder.items.map((item: any) => ({
              id: item.productId,
              name: item.product.name,
              price: item.priceAtPurchase,
              quantity: item.quantity,
              image: item.product.imageUrl,
            })),
            store: {
              name: "Nông Trại Xanh (Demo)", // BE chưa trả store in history
              slug: "nong-trai-xanh",
            },
            deliveryInfo: {
              name: "Giao hàng tiêu chuẩn",
              estimatedTime: "2-3 ngày",
              address: foundOrder.shippingAddress || "123 Cầu Giấy, Hà Nội",
              phone: foundOrder.phone || "0901234567",
              trackingNumber: `TRACK-${foundOrder.id.split('-')[0].toUpperCase()}`,
            },
            paymentMethod: "Thanh toán nội địa",
            shippingFee: 30000,
            discount: 0,
          });
        } else {
          toast.error("Không tìm thấy đơn hàng");
        }
      } catch (error: any) {
        toast.error(error.message || "Lỗi tải thông tin đơn hàng");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-12">Đang tải thông tin đơn hàng...</div>;
  }

  if (!order) {
    return <div className="text-center py-12 text-red-500">Đơn hàng không tồn tại.</div>;
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
                <BreadcrumbLink href="/tai-khoan/don-hang">Đơn hàng của tôi</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>Theo dõi đơn hàng</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col gap-6">
          <OrderHeader order={order} />

          <OrderStatusTimeline steps={order.status === "DELIVERED" ? mockTrackingTimelineDelivered : mockTrackingTimeline} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PurchasedProducts products={order.products} />
              <StoreInformation store={order.store} />
              {order.status === "COMPLETED" && <ReviewSection status={order.status} products={order.products} />}
            </div>

            {/* Right Column */}
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
