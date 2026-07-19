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
} from "@/components/ui";

import { useCartStore } from "@/store/useCartStore";
import { Voucher } from "@/types/cart";
import { VoucherBox } from "@/components/cart/VoucherBox";

import { mockDefaultAddress, mockShippingMethods, mockPaymentMethods } from "@/mock/checkout";
import {
  AddressCard,
  ShippingMethod,
  PaymentMethod,
  OrderItems,
  OrderSummary,
  CheckoutButton
} from "@/components/checkout";

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items: cartItems, buyNowItem, clearCart, clearBuyNowItem } = useCartStore();

  const isBuyNow = searchParams.get("type") === "buynow";
  const items = isBuyNow ? (buyNowItem ? [buyNowItem] : []) : cartItems;

  const [isMounted, setIsMounted] = useState(false);
  const [shippingMethodId, setShippingMethodId] = useState(mockShippingMethods[0].id);
  const [paymentMethodId, setPaymentMethodId] = useState(mockPaymentMethods[0].id);
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (isMounted && items.length === 0 && !isSuccess) {
      if (isBuyNow) {
        toast.error("Không tìm thấy sản phẩm");
        router.push("/san-pham");
      } else {
        toast.error("Giỏ hàng của bạn đang trống");
        router.push("/gio-hang");
      }
    }
  }, [items.length, isMounted, router, isBuyNow, isSuccess]);

  // Calculations
  const summaryData = useMemo(() => {
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let discount = 0;
    if (appliedVoucher && subTotal >= appliedVoucher.minOrderValue) {
      if (appliedVoucher.discountType === "fixed") {
        discount = appliedVoucher.discountValue;
      } else {
        discount = (subTotal * appliedVoucher.discountValue) / 100;
        if (appliedVoucher.maxDiscount && discount > appliedVoucher.maxDiscount) {
          discount = appliedVoucher.maxDiscount;
        }
      }
    }

    const selectedShipping = mockShippingMethods.find(m => m.id === shippingMethodId);
    let shippingFee = selectedShipping ? selectedShipping.price : 0;

    if (appliedVoucher?.code === "FREESHIP") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discountValue);
      discount = 0; // Move discount to shipping offset for simplicity
    }

    const tax = Math.round(subTotal * 0.08); // 8% VAT
    const total = Math.max(0, subTotal + shippingFee + tax - discount);

    return { subTotal, discount, shippingFee, tax, total };
  }, [items, appliedVoucher, shippingMethodId]);

  const handleCheckout = () => {
    setIsSubmitting(true);
    
    // Giả lập API gọi lên server
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      if (isBuyNow) {
        clearBuyNowItem();
      } else {
        clearCart();
      }
      
      toast.success("Đặt hàng thành công!", {
        description: "Cảm ơn bạn đã mua sắm tại AgriMarket.",
        duration: 5000,
      });
      
      router.push("/dat-hang-thanh-cong");
    }, 1000);
  };

  if (!isMounted || (items.length === 0 && !isSuccess)) {
    return null; // Return null to avoid flash of empty state before redirect
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 sm:pb-24">
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
                <BreadcrumbLink href="/gio-hang">Giỏ hàng</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink isCurrentPage>Thanh toán</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
            Thanh toán
          </h1>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
          
          {/* Cột trái: Form nhập liệu (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <AddressCard 
              address={mockDefaultAddress} 
              onChangeAddress={() => toast("Tính năng đổi địa chỉ đang được phát triển")}
            />
            
            <ShippingMethod 
              methods={mockShippingMethods}
              selectedId={shippingMethodId}
              onChange={setShippingMethodId}
            />

            <PaymentMethod 
              methods={mockPaymentMethods}
              selectedId={paymentMethodId}
              onChange={setPaymentMethodId}
            />

            <OrderItems items={items} />
          </div>

          {/* Cột phải: Summary (30%) */}
          <div className="w-full lg:w-[30%] flex flex-col gap-6 animate-in slide-in-from-bottom-8 duration-700 fade-in lg:sticky lg:top-24">
            
            <VoucherBox
              appliedVoucher={appliedVoucher}
              onApplyVoucher={setAppliedVoucher}
            />

            <OrderSummary
              subTotal={summaryData.subTotal}
              discount={summaryData.discount}
              shippingFee={summaryData.shippingFee}
              tax={summaryData.tax}
              total={summaryData.total}
            />
            
            {/* Desktop Checkout Button */}
            <div className="hidden lg:block">
              <CheckoutButton 
                isLoading={isSubmitting}
                onClick={handleCheckout}
              />
            </div>

          </div>
        </div>
      </PageContainer>

      {/* Mobile Sticky Checkout Button */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50 animate-in slide-in-from-bottom-full">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-semibold text-gray-600">Tổng thanh toán:</span>
          <span className="text-lg font-black text-emerald-600">
            {summaryData.total.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <CheckoutButton 
          isLoading={isSubmitting}
          onClick={handleCheckout}
        />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50/50 flex items-center justify-center">Đang tải...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
