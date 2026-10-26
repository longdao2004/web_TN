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

import { orderService } from "@/services/order.service";
import { toast } from "sonner";
import { TimelineStep } from "@/types/order";

// [Thực tế] Hàm sinh Timeline các bước dựa trên trạng thái đơn hàng thật trong Database
const generateOrderTimeline = (status: string): TimelineStep[] => {
  if (status === "CANCELLED") {
    return [
      { id: "1", label: "Đã đặt hàng", isCompleted: true, isActive: false },
      { id: "2", label: "Đã hủy đơn hàng", isCompleted: true, isActive: true },
    ];
  }

  return [
    {
      id: "1",
      label: "Đơn hàng đã đặt",
      isCompleted: true,
      isActive: status === "PENDING",
    },
    {
      id: "2",
      label: "Đang đóng gói",
      isCompleted: ["PACKING", "SHIPPING", "COMPLETED", "DELIVERED"].includes(
        status,
      ),
      isActive: status === "PACKING",
    },
    {
      id: "3",
      label: "Đang giao hàng",
      isCompleted: ["SHIPPING", "COMPLETED", "DELIVERED"].includes(status),
      isActive: status === "SHIPPING",
    },
    {
      id: "4",
      label: "Giao thành công",
      isCompleted: ["COMPLETED", "DELIVERED"].includes(status),
      isActive: status === "COMPLETED" || status === "DELIVERED",
    },
  ];
};

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Đưa hàm fetchOrder ra ngoài để ActionButtons bên dưới cũng gọi được
  const fetchOrder = async () => {
    try {
      const foundOrder = await orderService.getOrderById(id);

      if (foundOrder) {
        // [Thực tế] Lấy thông tin cửa hàng thực tế từ đơn hàng hoặc sản phẩm trong đơn
        const firstStore = foundOrder.store || foundOrder.items?.[0]?.product?.store;

        // Ánh xạ dữ liệu BE về định dạng FE cần
        setOrder({
          id: foundOrder.id,
          // TẠO MÃ ĐƠN HÀNG: Cắt phần đầu UUID, in hoa và thêm tiền tố 'AGRI-' (Ví dụ: AGRI-A1B2C3D4)
          code: `AGRI-${foundOrder.id.split("-")[0].toUpperCase()}`,
          status: foundOrder.status,
          createdAt: new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(foundOrder.createdAt)), // (Tùy chọn: format ngày giờ đẹp mắt)
          totalAmount: foundOrder.totalAmount,
          products: (foundOrder.items || []).map((item: any) => {
            const product = item.product || item.batch?.product;
            return {
              id: product?.id || item.productId || item.id,
              name: product?.name || "Sản phẩm",
              price: item.priceAtPurchase || 0,
              quantity: item.quantity || 1,
              image:
                product?.imageUrl || "/images/products/cachuabi.avif",
            };
          }),
          store: {
            name: firstStore?.name || "Cửa hàng Nông sản",
            slug: firstStore?.id || "",
            logo: firstStore?.logoUrl || undefined,
          },
          deliveryInfo: {
            name: foundOrder.user?.fullName || "Khách hàng",
            phone: foundOrder.user?.phone || "Không có",
            address: foundOrder.shippingAddress || "Chưa cung cấp",
            trackingNumber: `AGRI-${foundOrder.id.split("-")[0].toUpperCase()}`,
          },
          paymentMethod:
            foundOrder.paymentMethod === "VNPAY"
              ? "VNPay"
              : "Thanh toán khi nhận hàng (COD)",
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

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-12">Đang tải thông tin đơn hàng...</div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12 text-red-500">
        Đơn hàng không tồn tại.
      </div>
    );
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
                <BreadcrumbLink href="/tai-khoan/don-hang">
                  Đơn hàng của tôi
                </BreadcrumbLink>
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

          {/* [Thực tế] Sử dụng hàm sinh timeline tự động theo trạng thái thật của đơn hàng */}
          <OrderStatusTimeline steps={generateOrderTimeline(order.status)} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Cột trái */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              <PurchasedProducts products={order.products} />
              <StoreInformation store={order.store} />
              {(order.status === "COMPLETED" ||
                order.status === "DELIVERED") && (
                <ReviewSection
                  status={order.status}
                  products={order.products}
                />
              )}
            </div>

            {/* Cột phải */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <ShippingInformation info={order.deliveryInfo} />
              <PaymentSummary order={order} />
            </div>
          </div>

          <ActionButtons
            storeSlug={order.store?.slug}
            orderId={order.id}
            orderStatus={order.status}
            onOrderCancelled={() => fetchOrder()}
          />
        </div>

        <RecommendedProducts />
      </PageContainer>
    </div>
  );
}
