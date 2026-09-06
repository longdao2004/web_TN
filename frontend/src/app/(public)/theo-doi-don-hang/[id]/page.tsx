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
        // Lấy chi tiết đơn hàng thông qua API getOrderById (thay vì getOrderHistory)
        const foundOrder = await orderService.getOrderById(id);
        
        if (foundOrder) {
          // Ánh xạ dữ liệu BE về định dạng FE cần
          setOrder({
            id: foundOrder.id,
            status: foundOrder.status,
            createdAt: foundOrder.createdAt,
            totalAmount: foundOrder.totalAmount,
            products: foundOrder.items.map((item: any) => ({
              id: item.batch.product.id,
              name: item.batch.product.name,
              price: item.priceAtPurchase,
              quantity: item.quantity,
              image: item.batch.product.imageUrl || "/images/products/cachuabi.avif",
            })),
            store: {
              name: "Cửa hàng AgriMarket", 
              slug: "agrimarket",
            },
            deliveryInfo: {
              // Lấy Tên và Số điện thoại thực tế của khách hàng từ DB
              name: foundOrder.user?.fullName || "Khách hàng",
              phone: foundOrder.user?.phone || "Không có",
              address: foundOrder.shippingAddress || "Chưa cung cấp",
              trackingNumber: `TRACK-${foundOrder.id.split('-')[0].toUpperCase()}`,
            },
            paymentMethod: foundOrder.paymentMethod === "VNPAY" ? "VNPay" : "Thanh toán khi nhận hàng",
            shippingFee: 0,
            discount: 0,
          });
        }
      } catch (error: any) {
        toast.error(error.message || "Không thể tải thông tin đơn hàng");
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
        {/* Đường dẫn (Breadcrumb) */}
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

        <RecommendedProducts />
      </PageContainer>
    </div>
  );
}
