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
    fetchCart,
  } = useCartStore();

  const isBuyNow = searchParams.get("type") === "buynow";
  const itemsParam = searchParams.get("items");
  const selectedItemIds = useMemo(() => {
    return itemsParam ? itemsParam.split(",").filter(Boolean) : [];
  }, [itemsParam]);

  const items = useMemo(() => {
    if (isBuyNow) return buyNowItem ? [buyNowItem] : [];
    // 🟢 Nếu có truyền danh sách ID các món được chọn từ giỏ hàng, chỉ thanh toán các món đó
    if (selectedItemIds.length > 0) {
      return cartItems.filter((item) => selectedItemIds.includes(item.id));
    }
    return cartItems;
  }, [isBuyNow, buyNowItem, cartItems, selectedItemIds]);

  const [isMounted, setIsMounted] = useState(false);
  const [phoneText, setPhoneText] = useState("");
  const [addressText, setAddressText] = useState("");

  const [shippingMethodId, setShippingMethodId] = useState(
    SHIPPING_METHODS[0].id,
  );
  const [paymentMethodId, setPaymentMethodId] = useState(PAYMENT_METHODS[0].id);
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

      // CHẶN ADMIN KHÔNG CHO VÀO THANH TOÁN
      if (user?.role === "ADMIN") {
        toast.warning("Tài khoản Quản trị viên chỉ có chức năng quản trị, không thể thực hiện đặt hàng!");
        router.push("/admin");
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
  }, [isMounted, items.length, isSuccess, isBuyNow, router, isAuthenticated, user]);

    // 🟢 PHÂN LOẠI VẬN CHUYỂN THEO ĐẶC THÙ SINH HỌC CỦA NÔNG SẢN
  const hasUltraFresh = useMemo(
    () => items.some((i) => (i as any).logisticsTier === "ULTRA_FRESH"),
    [items]
  );
  const hasChilled = useMemo(
    () => items.some((i) => (i as any).logisticsTier === "CHILLED"),
    [items]
  );

  // 🟢 GỢI Ý 1: HIỂN THỊ ĐỦ 3 PHƯƠNG THỨC, LÀM MỜ VÀ GẮN NHÃN GIẢI THÍCH
  const displayShippingMethods = useMemo(() => {
    return SHIPPING_METHODS.map((method) => {
      // 1. Nếu đơn hàng có thực phẩm Siêu tươi (ULTRA_FRESH)
      if (hasUltraFresh) {
        if (method.id === "ship-express") {
          return {
            ...method,
            disabled: false,
            badge: "Bắt buộc cho hàng siêu tươi",
          };
        }
        return {
          ...method,
          disabled: true,
          disabledReason: "Không áp dụng cho thực phẩm siêu tươi (nguy cơ hư hỏng)",
        };
      }

      // 2. Nếu đơn hàng có nông sản Bảo quản mát (CHILLED)
      if (hasChilled) {
        if (method.id === "ship-standard") {
          return {
            ...method,
            disabled: true,
            disabledReason: "Không áp dụng cho trái cây/nông sản cần giữ mát 2°C - 8°C",
          };
        }
        return {
          ...method,
          disabled: false,
          badge: method.id === "ship-cold" ? "Khuyên dùng (Cold Chain)" : undefined,
        };
      }

      // 3. Đơn hàng Nông sản khô (DRY_STABLE): Tất cả đều khả dụng
      return {
        ...method,
        disabled: false,
      };
    });
  }, [hasUltraFresh, hasChilled]);

  // Tự động chuyển sang phương thức khả dụng đầu tiên nếu phương thức đang chọn bị khóa
  useEffect(() => {
    const currentMethod = displayShippingMethods.find((m) => m.id === shippingMethodId);
    if (!currentMethod || currentMethod.disabled) {
      const firstValid = displayShippingMethods.find((m) => !m.disabled);
      if (firstValid) {
        setShippingMethodId(firstValid.id);
      }
    }
  }, [displayShippingMethods, shippingMethodId]);

  // 🟢 Tính toán dữ liệu thanh toán (Hỗ trợ Đa gian hàng)
  const summaryData = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = 0; // Đã bỏ mục voucher
    const selectedMethod = SHIPPING_METHODS.find(
      (m) => m.id === shippingMethodId,
    );
    const baseShippingFee = selectedMethod ? selectedMethod.price : 25000;

    // Đếm số gian hàng độc lập để tính phí vận chuyển theo từng địa phương
    const storeCount =
      new Set(items.map((i) => i.store?.id || (i as any).storeId || i.store?.name)).size || 1;

    // Miễn phí vận chuyển nếu đơn hàng > 500.000đ, ngược lại nhân theo số gian hàng
    const shippingFee =
      subTotal > 500000 || subTotal === 0 ? 0 : baseShippingFee * storeCount;
    const tax = 0;
    const total = subTotal + shippingFee;
    return { subTotal, discount, shippingFee, tax, total, storeCount };
  }, [items, shippingMethodId]);

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      if (!phoneText || !addressText) {
        toast.error("Vui lòng nhập đầy đủ số điện thoại và địa chỉ giao hàng!");
        setIsSubmitting(false);
        return;
      }

      // Tạo payload đơn hàng: gửi đầy đủ địa chỉ, số điện thoại và phí vận chuyển
      const payload: {
        shippingAddress: string;
        phone: string;
        shippingFee: number;
        productId?: string;
        quantity?: number;
        cartItemIds?: string[];
      } = {
        shippingAddress: addressText,
        phone: phoneText,
        shippingFee: summaryData.shippingFee,
      };

      if (isBuyNow && items.length > 0) {
        payload.productId = items[0].id || (items[0] as any).productId;
        payload.quantity = items[0].quantity;
      } else {
        // 🟢 Truyền danh sách ID các món được chọn trong giỏ hàng để Backend chỉ xử lý và xóa các món này
        payload.cartItemIds = items.map((i) => i.id);
      }

      const orderRes = await orderService.createOrder(payload);

      // Xác định phương thức thanh toán
      const selectedPayment = PAYMENT_METHODS.find(
        (p) => p.id === paymentMethodId,
      );
      const provider = selectedPayment?.provider || "COD";

      // 🟢 Truyền danh sách tất cả các đơn hàng con (orderIds) để Backend xử lý thanh toán gộp
      const paymentRes = await orderService.createPaymentUrl({
        orderId: orderRes.orderId,
        orderIds: orderRes.orderIds || [orderRes.orderId],
        provider,
      });

      if (isBuyNow) {
        clearBuyNowItem();
      } else {
        // 🟢 Cập nhật lại giỏ hàng (chỉ lấy các sản phẩm chưa mua còn lại trong DB)
        await fetchCart();
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

                        {/* 2. Phương thức vận chuyển (Lọc theo đặc thù nông sản) */}
            <div className="flex flex-col gap-3">
              {/* Thông báo nghiệp vụ thông minh cho khách hàng */}
              {hasUltraFresh ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <span className="font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px]">
                    Siêu tươi sống
                  </span>
                  Đơn hàng có thực phẩm siêu tươi (thịt/thủy sản/sữa thanh trùng). Hệ thống chỉ áp dụng <b>Giao hỏa tốc 2H</b> để đảm bảo chất lượng.
                </div>
              ) : hasChilled ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-700 flex items-center gap-2">
                  <span className="font-bold uppercase bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px]">
                    Bảo quản mát
                  </span>
                  Đơn hàng có nông sản bảo quản mát (trái cây tươi/sữa chua). Đã kích hoạt <b>Vận chuyển chuỗi lạnh (Cold Chain)</b> để kiểm soát nhiệt độ 2°C - 8°C.
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                  <span className="font-bold uppercase bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[10px]">
                    Nông sản khô
                  </span>
                  Đơn hàng gồm nông sản khô bảo quản thường. Bạn có thể chọn Giao tiêu chuẩn để tiết kiệm chi phí.
                </div>
              )}

              <ShippingMethod
                methods={displayShippingMethods}
                selectedId={shippingMethodId}
                onChange={setShippingMethodId}
              />
            </div>

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
