"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PageContainer } from "@/components/layout/core";
import {
  OrderSuccessHero,
  OrderSummary,
  DeliveryInformation,
  PurchasedProducts,
  OrderTimeline,
  ActionButtons,
  RecommendedProducts,
} from "@/components/order-success";
import { AlertCircle, Loader2 } from "lucide-react";
import { orderService } from "@/services/order.service";

// Tạm thời định nghĩa TimelineSteps ảo để map status thật vào
const getTimelineSteps = (status: string) => {
  return [
    {
      id: "1",
      label: "Đơn hàng đã đặt",
      date: "",
      isCompleted: true,
      isActive: status === "PENDING",
    },
    {
      id: "2",
      label: "Đang đóng gói",
      date: "",
      isCompleted: ["PACKING", "SHIPPING", "COMPLETED", "DELIVERED"].includes(
        status,
      ),
      isActive: status === "PACKING",
    },
    {
      id: "3",
      label: "Đang giao hàng",
      date: "",
      isCompleted: ["SHIPPING", "COMPLETED", "DELIVERED"].includes(status),
      isActive: status === "SHIPPING",
    },
    {
      id: "4",
      label: "Giao thành công",
      date: "",
      isCompleted: ["COMPLETED", "DELIVERED"].includes(status),
      isActive: status === "COMPLETED" || status === "DELIVERED",
    },
  ];
};

export const OrderSuccessClient = () => {
  const searchParams = useSearchParams();

  const code = searchParams.get("code");
  const message = searchParams.get("message");
  const orderId = searchParams.get("orderId");

  const isError = code && code !== "00";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isError || !orderId) {
      setLoading(false);
      return;
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(orderId);

        // Map backend data to frontend expected format
        const mappedOrder = {
          id: data.id,
          // Bổ sung các trường dữ liệu mà component OrderSummary đang gọi (để tránh lỗi undefined)
          code: data.id.split("-")[0].toUpperCase(), // Tạo mã đơn hàng ngắn từ UUID
          createdAt: new Date(data.createdAt).toLocaleDateString("vi-VN"), // Chuyển đổi ngày đặt hàng
          totalAmount: data.totalAmount, // <-- Fix lỗi: Component gọi totalAmount thay vì total

          date: new Date(data.createdAt).toISOString(),
          paymentMethod:
            data.paymentMethod === "VNPAY"
              ? "VNPay"
              : "Thanh toán khi nhận hàng",
          shippingMethod: "Giao hàng tiêu chuẩn",
          status: data.status,
          total: data.totalAmount,
          subtotal: data.totalAmount, // Assuming no shipping fee field in DB yet
          shippingFee: 0,
          discount: 0,
          products: data.items.map((item: any) => ({
            id: item.batch.product.id,
            name: item.batch.product.name,
            price: item.priceAtPurchase,
            quantity: item.quantity,
            image:
              item.batch.product.imageUrl || "/images/products/cachuabi.avif",
            store: item.batch?.product?.store?.name || "Cửa hàng Nông sản",
          })),
          deliveryInfo: {
            name: data.user?.fullName || "Khách hàng", // Đã lấy được tên thật của Khách từ DB
            phone: data.user?.phone || "Không có", // Lấy số điện thoại từ Profile người dùng
            address: data.shippingAddress || "Không có",
          },
        };

        setOrder(mappedOrder);
      } catch (error) {
        console.error("Lỗi lấy đơn hàng", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, isError]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        {isError ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Thanh toán thất bại
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {message || "Giao dịch không thành công hoặc đã bị hủy."}
            </p>
            <ActionButtons orderId={orderId || undefined} />
          </div>
        ) : !order ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Không tìm thấy đơn hàng
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Xin lỗi, chúng tôi không thể tải dữ liệu đơn hàng này.
            </p>
            <ActionButtons orderId={orderId || undefined} />
          </div>
        ) : (
          <>
            <OrderSuccessHero />
            <div className="mt-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Column (Timeline & Products) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <OrderTimeline steps={getTimelineSteps(order.status)} />
                  <PurchasedProducts products={order.products} />
                </div>

                {/* Right Column (Summary & Delivery) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <OrderSummary order={order} />
                  <DeliveryInformation info={order.deliveryInfo} />
                </div>
              </div>

              <ActionButtons orderId={order.id} />
            </div>

            {/* Recommended Products */}
            <RecommendedProducts />
          </>
        )}
      </PageContainer>
    </div>
  );
};
