"use client";

import React, { useState, useMemo, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
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
  Radio,
} from "@/components/ui";

import { useCartStore } from "@/store/useCartStore";
import { orderService } from "@/services/order.service";
import { useAuthStore } from "@/store/auth.store";
import {
  SHIPPING_METHODS,
  PAYMENT_METHODS,
} from "@/constants/checkout.constants";

import {
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
        toast.warning(
          "Tài khoản Quản trị viên chỉ có chức năng quản trị, không thể thực hiện đặt hàng!",
        );
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

  // 🟢 1. PHÂN NHÓM SẢN PHẨM THEO TỪNG GIAN HÀNG ĐỂ QUẢN LÝ VẬN CHUYỂN RIÊNG BIỆT
  const storeGroups = useMemo(() => {
    const groups: Record<
      string,
      {
        storeKey: string;
        storeId: string;
        storeName: string;
        items: typeof items;
        hasUltraFresh: boolean;
        hasChilled: boolean;
      }
    > = {};

    for (const item of items) {
      const storeKey =
        item.store?.id || (item as any).storeId || item.store?.name || "gian-hang";
      const storeId = item.store?.id || (item as any).storeId || storeKey;
      const storeName = item.store?.name || "Gian hàng Nông sản";

      if (!groups[storeKey]) {
        groups[storeKey] = {
          storeKey,
          storeId,
          storeName,
          items: [],
          hasUltraFresh: false,
          hasChilled: false,
        };
      }

      groups[storeKey].items.push(item);
      if ((item as any).logisticsTier === "ULTRA_FRESH") {
        groups[storeKey].hasUltraFresh = true;
      }
      if ((item as any).logisticsTier === "CHILLED") {
        groups[storeKey].hasChilled = true;
      }
    }

    return Object.values(groups);
  }, [items]);

  // 🟢 2. XÁC ĐỊNH PHƯƠNG THỨC GIAO HÀNG PHÙ HỢP CHO RIÊNG TỪNG GIAN HÀNG
  const getStoreShippingMethods = (group: {
    hasUltraFresh: boolean;
    hasChilled: boolean;
  }) => {
    return SHIPPING_METHODS.map((method) => {
      // Nếu gian hàng có thực phẩm siêu tươi (ULTRA_FRESH): Bắt buộc Hỏa tốc
      if (group.hasUltraFresh) {
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

      // Nếu gian hàng có hàng bảo quản mát (CHILLED): Khóa Tiêu chuẩn, mở Chuỗi lạnh / Hỏa tốc
      if (group.hasChilled) {
        if (method.id === "ship-standard") {
          return {
            ...method,
            disabled: true,
            disabledReason: "Không áp dụng cho nông sản cần giữ mát 2°C - 8°C",
          };
        }
        return {
          ...method,
          disabled: false,
          badge: method.id === "ship-cold" ? "Khuyên dùng (Cold Chain)" : undefined,
        };
      }

      // Nếu toàn bộ là hàng khô (DRY_STABLE): Mở toàn bộ
      return {
        ...method,
        disabled: false,
      };
    });
  };

  // 🟢 3. QUẢN LÝ PHƯƠNG THỨC VẬN CHUYỂN RIÊNG CHO TỪNG GIAN HÀNG
  const [selectedShippingMethods, setSelectedShippingMethods] = useState<
    Record<string, string>
  >({});

  // Tự động khởi tạo hoặc cập nhật phương thức khả dụng đầu tiên cho từng gian hàng
  useEffect(() => {
    setSelectedShippingMethods((prev) => {
      const updated = { ...prev };
      let hasChanges = false;

      for (const group of storeGroups) {
        const availableMethods = getStoreShippingMethods(group);
        const currentId = updated[group.storeKey];
        const currentMethod = availableMethods.find((m) => m.id === currentId);

        if (!currentMethod || currentMethod.disabled) {
          const firstValid = availableMethods.find((m) => !m.disabled);
          if (firstValid) {
            updated[group.storeKey] = firstValid.id;
            hasChanges = true;
          }
        }
      }

      return hasChanges ? updated : prev;
    });
  }, [storeGroups]);

  const handleSelectStoreShipping = (storeKey: string, methodId: string) => {
    setSelectedShippingMethods((prev) => ({
      ...prev,
      [storeKey]: methodId,
    }));
  };

  // 🟢 4. KIỂM TRA ĐẶC TÍNH BẢO QUẢN TOÀN BỘ ĐƠN HÀNG ĐỂ HIỂN THỊ BANNER NHẮC NHỞ
  const hasAnyUltraFresh = useMemo(
    () => storeGroups.some((g) => g.hasUltraFresh),
    [storeGroups],
  );
  const hasAnyChilled = useMemo(
    () => storeGroups.some((g) => g.hasChilled),
    [storeGroups],
  );

  // 🟢 5. TÍNH TOÁN DỮ LIỆU THANH TOÁN (HỖ TRỢ PHÍ VẬN CHUYỂN RIÊNG TỪNG GIAN HÀNG)
  const summaryData = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = 0; // Đã bỏ mục voucher

    // Bảng phân bổ phí vận chuyển riêng theo từng gian hàng
    const storeShippingBreakdown = storeGroups.map((group) => {
      const selectedId =
        selectedShippingMethods[group.storeKey] ||
        getStoreShippingMethods(group).find((m) => !m.disabled)?.id ||
        SHIPPING_METHODS[0].id;

      const method = SHIPPING_METHODS.find((m) => m.id === selectedId);
      const baseFee = method ? method.price : 25000;
      // Miễn phí vận chuyển nếu tổng đơn > 500.000đ
      const fee = subTotal > 500000 || subTotal === 0 ? 0 : baseFee;

      return {
        storeKey: group.storeKey,
        storeId: group.storeId,
        storeName: group.storeName,
        methodId: selectedId,
        fee,
      };
    });

    // Tổng phí vận chuyển = Tổng phí của tất cả các gian hàng
    const shippingFee = storeShippingBreakdown.reduce((sum, s) => sum + s.fee, 0);
    const tax = 0;
    const total = subTotal + shippingFee;

    return {
      subTotal,
      discount,
      shippingFee,
      tax,
      total,
      storeShippingBreakdown,
    };
  }, [items, storeGroups, selectedShippingMethods]);

  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      if (!phoneText || !addressText) {
        toast.error("Vui lòng nhập đầy đủ số điện thoại và địa chỉ giao hàng!");
        setIsSubmitting(false);
        return;
      }

      // Tạo danh sách phí vận chuyển theo từng storeId để gửi sang Backend
      const storeShippingFees: Record<string, number> = {};
      for (const item of summaryData.storeShippingBreakdown) {
        storeShippingFees[item.storeId] = item.fee;
      }

      // Tạo payload đơn hàng: gửi đầy đủ địa chỉ, số điện thoại và phí vận chuyển từng gian hàng
      const payload: {
        shippingAddress: string;
        phone: string;
        shippingFee: number;
        storeShippingFees: Record<string, number>;
        productId?: string;
        quantity?: number;
        cartItemIds?: string[];
      } = {
        shippingAddress: addressText,
        phone: phoneText,
        shippingFee: summaryData.shippingFee,
        storeShippingFees,
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
          {/* Cột trái (Thông tin nhận hàng, Vận chuyển từng gian hàng, Thanh toán) */}
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

            {/* 2. Phương thức vận chuyển độc lập theo từng gian hàng */}
            <div className="flex flex-col gap-4">
              {/* Thông báo nghiệp vụ thông minh cho khách hàng */}
              {hasAnyUltraFresh ? (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                  <span className="font-bold uppercase bg-red-600 text-white px-1.5 py-0.5 rounded text-[10px]">
                    Siêu tươi sống
                  </span>
                  Đơn hàng có thực phẩm siêu tươi (thịt/thủy sản/sữa thanh trùng). Hệ thống chỉ áp dụng <b>Giao hỏa tốc 2H</b> để đảm bảo chất lượng.
                </div>
              ) : hasAnyChilled ? (
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

              {/* Danh sách các khối Đơn hàng theo từng gian hàng */}
              <div
                className={`grid grid-cols-1 ${
                  storeGroups.length > 1 ? "md:grid-cols-2" : ""
                } gap-4`}
              >
                {storeGroups.map((group, idx) => {
                  const methods = getStoreShippingMethods(group);
                  const selectedMethodId =
                    selectedShippingMethods[group.storeKey] ||
                    methods.find((m) => !m.disabled)?.id ||
                    SHIPPING_METHODS[0].id;

                  return (
                    <div
                      key={group.storeKey}
                      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        {/* Tiêu đề Đơn hàng con */}
                        <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-3 flex items-center justify-between">
                          <span>
                            Đơn hàng {idx + 1} - {group.storeName}{" "}
                            <span className="text-gray-400 font-normal">
                              ({group.items.length} món)
                            </span>
                          </span>
                        </h3>

                        {/* Danh sách sản phẩm của gian hàng này */}
                        <div className="space-y-3 pb-4 border-b border-gray-100 mb-4">
                          {group.items.map((item) => (
                            <div key={item.id} className="flex gap-3 items-center">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 truncate">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-gray-500 truncate">
                                  {item.category || item.store?.name}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs sm:text-sm font-bold text-gray-900">
                                  {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                                </span>
                                <span className="block text-[10px] text-gray-400">
                                  x{item.quantity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Bộ chọn phương thức giao hàng cho riêng gian hàng này */}
                        <div className="space-y-2.5">
                          {methods.map((method) => {
                            const isSelected = selectedMethodId === method.id;
                            const isDisabled = method.disabled === true;

                            return (
                              <div
                                key={method.id}
                                onClick={() => {
                                  if (!isDisabled) {
                                    handleSelectStoreShipping(group.storeKey, method.id);
                                  }
                                }}
                                className={`relative flex items-start p-3 rounded-xl border-2 transition-all duration-200 ${
                                  isDisabled
                                    ? "border-gray-100 bg-gray-50/70 opacity-50 cursor-not-allowed"
                                    : isSelected
                                    ? "border-emerald-500 bg-emerald-50/40 cursor-pointer shadow-2xs"
                                    : "border-gray-100 hover:border-emerald-200 hover:bg-gray-50/50 cursor-pointer"
                                }`}
                              >
                                <Radio
                                  checked={isSelected && !isDisabled}
                                  disabled={isDisabled}
                                  onChange={() =>
                                    !isDisabled &&
                                    handleSelectStoreShipping(group.storeKey, method.id)
                                  }
                                  className="mt-0.5"
                                />
                                <div className="ml-2.5 flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-1 flex-wrap">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span
                                        className={`text-xs sm:text-sm font-semibold ${
                                          isDisabled
                                            ? "text-gray-400"
                                            : isSelected
                                            ? "text-emerald-900"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        {method.name}
                                      </span>
                                      {method.badge && (
                                        <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-1.5 py-0.2 rounded-full">
                                          {method.badge}
                                        </span>
                                      )}
                                    </div>
                                    <span
                                      className={`text-xs font-bold shrink-0 ${
                                        isDisabled
                                          ? "text-gray-400"
                                          : isSelected
                                          ? "text-emerald-600"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {method.price.toLocaleString("vi-VN")}đ
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">
                                    {method.estimatedTime}
                                  </p>
                                  {method.disabledReason && (
                                    <p className="text-[10px] text-red-500 mt-0.5 flex items-center gap-1">
                                      ⚠️ {method.disabledReason}
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
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
              storeShippingBreakdown={summaryData.storeShippingBreakdown}
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
