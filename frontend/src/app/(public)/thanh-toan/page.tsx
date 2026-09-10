"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  Input,
  Textarea,
} from "@/components/ui";

import { useCartStore } from "@/store/useCartStore";
import { Voucher } from "@/types/cart";
import { VoucherBox } from "@/components/cart/VoucherBox";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";
import {
  SHIPPING_METHODS,
  PAYMENT_METHODS,
} from "@/constants/checkout.constants";

import {
  ShippingMethod,
  PaymentMethod,
  OrderItems,
  OrderSummary,
  CheckoutButton,
} from "@/components/checkout";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuthStore();
  const {
    items: cartItems,
    buyNowItem,
    clearCart,
    clearBuyNowItem,
  } = useCartStore();

  const isBuyNow = searchParams.get("type") === "buynow";
  const items = useMemo(
    () => (isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems),
    [isBuyNow, buyNowItem, cartItems],
  );

  const [isMounted, setIsMounted] = useState(false);
  const [phoneText, setPhoneText] = useState("");
  const [addressText, setAddressText] = useState("");

  const [shippingMethodId, setShippingMethodId] = useState(
    SHIPPING_METHODS[0].id,
  );
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Tự động điền dữ liệu người dùng
  useEffect(() => {
    if (user) {
      setPhoneText(user.phone || "");
      setAddressText(user.address || "");
    }
  }, [user]);

  // Kiểm tra bảo mật và chuyển hướng nếu giỏ hàng rỗng
  useEffect(() => {
    if (isMounted) {
      if (!isAuthenticated) {
        toast.error("Vui lòng đăng nhập để thanh toán!");
        router.push("/dang-nhap");
        return;
      }

      if (items.length === 0 && !isSuccess) {
        if (isBuyNow) {
          toast.error("Không tìm thấy sản phẩm");
        } else {
          toast.info("Giỏ hàng của bạn đang trống");
        }
        router.push("/gio-hang");
      }
    }
  }, [isMounted, items.length, isSuccess, isBuyNow, router, isAuthenticated]);

  // Tính toán dữ liệu
  const summaryData = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let discount = 0;
    if (appliedVoucher && subTotal >= appliedVoucher.minOrderValue) {
      if (appliedVoucher.discountType === "fixed") {
        discount = appliedVoucher.discountValue;
      } else {
        discount = (subTotal * appliedVoucher.discountValue) / 100;
        if (
          appliedVoucher.maxDiscount &&
          discount > appliedVoucher.maxDiscount
        ) {
          discount = appliedVoucher.maxDiscount;
        }
      }
    }

    const selectedShipping = SHIPPING_METHODS.find(
      (m) => m.id === shippingMethodId,
    );
    let shippingFee = selectedShipping ? selectedShipping.price : 0;

    if (appliedVoucher?.code === "FREESHIP") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discountValue);
      discount = 0;
    }

    const tax = Math.round(subTotal * 0.08); // 8% VAT
    const total = Math.max(0, subTotal + shippingFee + tax - discount);

    return { subTotal, discount, shippingFee, tax, total };
  }, [items, appliedVoucher, shippingMethodId]);

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      if (!phoneText || !addressText) {
        toast.error("Vui lòng nhập đầy đủ số điện thoại và địa chỉ giao hàng!");
        setIsSubmitting(false);
        return;
      }

            // Tạo payload đơn hàng: nếu là "Mua ngay" thì gửi kèm productId & quantity
      const payload: {
        shippingAddress: string;
        phone: string;
        productId?: string;
        quantity?: number;
      } = {
        shippingAddress: addressText,
        phone: phoneText,
      };

      if (isBuyNow && items.length > 0) {
        payload.productId = items[0].id || (items[0] as any).productId;
        payload.quantity = items[0].quantity;
      }

      const orderRes = await orderService.createOrder(payload);

      // Xác định phương thức thanh toán
      const selectedPayment = PAYMENT_METHODS.find(
        (p) => p.id === paymentMethodId,
      );
      const provider = selectedPayment?.provider || "COD";

      const paymentRes = await orderService.createPaymentUrl({
        orderId: orderRes.orderId,
        provider,
      });

      if (isBuyNow) {
        clearBuyNowItem();
      } else {
        clearCart();
      }

      if (provider === "VNPAY" && paymentRes.url) {
        window.location.href = paymentRes.url;
      } else {
        setIsSuccess(true);
        toast.success("Đặt hàng thành công!", {
          description: "Cảm ơn bạn đã mua sắm tại AgriMarket.",
          duration: 5000,
        });
        router.push(`/dat-hang-thanh-cong?orderId=${orderRes.orderId}`);
      }
    } catch (error: any) {
      toast.error(error.message || "Lỗi đặt hàng. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || (items.length === 0 && !isSuccess)) {
    return null;
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 sm:pb-24">
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
                <BreadcrumbLink href="/gio-hang">Giỏ hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>Thanh toán</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Cột trái (Thông tin nhận hàng, Vận chuyển, Thanh toán) */}
          <div className="w-full lg:w-[65%] flex flex-col gap-6">
            {/* 1. Thông tin giao hàng */}
            <div className="bg-white rounded-2xl p-6 border border-[var(--color-border)] shadow-sm">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Thông tin giao hàng
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ và tên
                  </label>
                  <Input
                    value={user?.fullName || "Khách hàng"}
                    disabled
                    className="bg-gray-50 text-gray-600 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={phoneText}
                    onChange={(e) => setPhoneText(e.target.value)}
                    placeholder="Nhập số điện thoại nhận hàng..."
                    required
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Địa chỉ nhận hàng <span className="text-red-500">*</span>
                  </label>
                  <Textarea
                    value={addressText}
                    onChange={(e) => setAddressText(e.target.value)}
                    placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 2. Phương thức vận chuyển (Gọi trực tiếp component tổng) */}
            <ShippingMethod
              methods={SHIPPING_METHODS}
              selectedId={shippingMethodId}
              onChange={setShippingMethodId}
            />

            {/* 3. Phương thức thanh toán (Gọi trực tiếp component tổng) */}
            <PaymentMethod
              methods={PAYMENT_METHODS}
              selectedId={paymentMethodId}
              onChange={setPaymentMethodId}
            />
          </div>

          {/* Cột phải (Danh sách sản phẩm & Tóm tắt đơn hàng) */}
          <div className="w-full lg:w-[35%] flex flex-col gap-6 sticky top-24">
            <OrderItems items={items} />

            <VoucherBox
              onApplyVoucher={setAppliedVoucher}
              appliedVoucher={appliedVoucher}
            />

            <OrderSummary
              subTotal={summaryData.subTotal}
              discount={summaryData.discount}
              shippingFee={summaryData.shippingFee}
              tax={summaryData.tax}
              total={summaryData.total}
            />

            <CheckoutButton
              onClick={handleCheckout}
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </div>
        </div>
      </PageContainer>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center">Đang tải trang thanh toán...</div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
