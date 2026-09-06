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

const SHIPPING_METHODS = [
  {
    id: 'ship-standard',
    name: 'Giao hàng tiêu chuẩn',
    estimatedTime: '2 - 3 ngày làm việc',
    price: 30000,
  },
  {
    id: 'ship-express',
    name: 'Giao hàng hỏa tốc',
    estimatedTime: 'Nhận hàng trong 2H',
    price: 55000,
  },
];

const PAYMENT_METHODS = [
  {
    id: 'pay-cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    iconType: 'cod' as any,
    description: 'Thanh toán bằng tiền mặt khi shipper giao hàng',
  },
  {
    id: 'pay-vnpay',
    name: 'Cổng thanh toán VNPay',
    iconType: 'vnpay' as any,
  },
];
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
  const [paymentMethodId, setPaymentMethodId] = useState(
    PAYMENT_METHODS[0].id,
  );
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
      discount = 0; // Đưa phần giảm giá sang bù trừ phí ship cho đơn giản
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

      const orderRes = await orderService.createOrder({ 
        shippingAddress: addressText, 
        phone: phoneText 
      });

      // 2. Xác định phương thức thanh toán
      // Chỉ hỗ trợ COD và VNPAY dựa theo Provider của BE
      const provider = paymentMethodId === 'pay-vnpay' ? 'VNPAY' : 'COD';

      const paymentRes = await orderService.createPaymentUrl({
        orderId: orderRes.orderId,
        provider,
      });

      if (isBuyNow) {
        clearBuyNowItem();
      } else {
        clearCart();
      }

      if (provider === 'VNPAY' && paymentRes.url) {
        // Redirect đến trang thanh toán của VNPay
        window.location.href = paymentRes.url;
      } else {
        // COD: Chuyển thẳng đến trang thành công kèm theo orderId
        setIsSuccess(true);
        toast.success("Đặt hàng thành công!", {
          description: "Cảm ơn bạn đã mua sắm tại AgriMarket.",
          duration: 5000,
        });
        router.push(`/dat-hang-thanh-cong?orderId=${orderRes.orderId}`);
      }
    } catch (error: any) {
      toast.error(error.message || 'Lỗi đặt hàng. Vui lòng thử lại!');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted || (items.length === 0 && !isSuccess)) {
    return null; // Trả về null để tránh chớp nhoáng giao diện trống trước khi chuyển hướng
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
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
            Thanh toán
          </h1>
        </div>

        {/* Layout */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start relative">
          {/* Cột trái: Form nhập liệu (70%) */}
          <div className="w-full lg:w-[70%] flex flex-col gap-6 animate-in slide-in-from-bottom-4 duration-500 fade-in">
            <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                Thông tin giao hàng
              </h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <Input 
                    value={phoneText} 
                    onChange={(e) => setPhoneText(e.target.value)} 
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ chi tiết</label>
                  <Textarea 
                    value={addressText} 
                    onChange={(e) => setAddressText(e.target.value)} 
                    placeholder="Ví dụ: 123 Đường số 1, Phường An Phú, Quận 2, TP.HCM"
                    rows={3}
                  />
                </div>
              </div>
            </div>

            <ShippingMethod
              methods={SHIPPING_METHODS}
              selectedId={shippingMethodId}
              onChange={setShippingMethodId}
            />

            <PaymentMethod
              methods={PAYMENT_METHODS}
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
          <span className="text-sm font-semibold text-gray-600">
            Tổng thanh toán:
          </span>
          <span className="text-lg font-black text-emerald-600">
            {summaryData.total.toLocaleString("vi-VN")}đ
          </span>
        </div>
        <CheckoutButton isLoading={isSubmitting} onClick={handleCheckout} />
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
          Đang tải...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
