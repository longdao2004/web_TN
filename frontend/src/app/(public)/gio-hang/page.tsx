"use client";
import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";
import { Voucher, CartSummaryData } from "@/types/cart";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import {
  CartList,
  CartSummary,
  VoucherBox,
  EmptyCart,
  DeleteConfirmModal,
} from "@/components/cart";
import { SHIPPING_METHODS } from "@/constants/checkout.constants"; 

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, fetchCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Vui lòng đăng nhập để xem giỏ hàng!");
      router.push("/dang-nhap");
      return;
    }
    fetchCart();
  }, [fetchCart, isAuthenticated, router]);

  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // 🟢 Tự động khởi tạo khi tải giỏ hàng: Chỉ chọn các món CHƯA HẾT HẠN của 1 cửa hàng
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemIds((prev) => {
        // Chỉ giữ lại các món còn tồn tại VÀ chưa hết hạn
        const validPrev = prev.filter((id) =>
          items.some((item) => item.id === id && !item.isExpired)
        );
        if (validPrev.length > 0) {
          const prevItems = items.filter((i) => validPrev.includes(i.id));
          const prevStoreKeys = Array.from(
            new Set(prevItems.map((i) => i.store?.id || i.store?.name))
          );
          if (prevStoreKeys.length <= 1) {
            return validPrev;
          }
        }
        // Lấy danh sách sản phẩm còn hạn
        const activeItems = items.filter((i) => !i.isExpired);
        if (activeItems.length === 0) return [];

        // Mặc định chọn tất cả sản phẩm còn hạn của cửa hàng đầu tiên trong giỏ
        const firstStoreKey =
          activeItems[0]?.store?.id || activeItems[0]?.store?.name;
        const firstStoreItems = activeItems.filter(
          (i) => (i.store?.id || i.store?.name) === firstStoreKey
        );
        return firstStoreItems.map((i) => i.id);
      });
    } else {
      setSelectedItemIds([]);
    }
  }, [items]);

  // 🟢 Xử lý khi người dùng tích chọn / bỏ chọn từng sản phẩm
  const handleSelectItem = (id: string, selected: boolean) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    // Chặn người dùng nếu cố tích chọn sản phẩm đã hết hạn
    if (targetItem.isExpired) {
      toast.error("Sản phẩm này đã hết hạn sử dụng, vui lòng xóa khỏi giỏ hàng!");
      return;
    }

    if (selected) {
      // Lấy danh sách cửa hàng của các sản phẩm đang được chọn
      const currentlySelectedItems = items.filter((i) => selectedItemIds.includes(i.id));
      const selectedStoreKeys = Array.from(
        new Set(currentlySelectedItems.map((i) => i.store?.id || i.store?.name))
      );

      const targetStoreKey = targetItem.store?.id || targetItem.store?.name;

      // Nếu đang chọn món của cửa hàng khác: Bật thông báo cho người dùng biết
      if (selectedStoreKeys.length > 0 && !selectedStoreKeys.includes(targetStoreKey)) {
        toast.warning(
          "Website hiện chưa hỗ trợ thanh toán nhiều sản phẩm của các cửa hàng khác nhau trong cùng một đơn. Vui lòng chọn và thanh toán sản phẩm của từng cửa hàng!",
          { duration: 5000 }
        );
        return;
      }

      setSelectedItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedItemIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // 🟢 Xử lý khi người dùng bấm "Chọn tất cả" (Chỉ chọn các món còn hạn)
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      // Chỉ xét các món chưa hết hạn
      const activeItems = items.filter((i) => !i.isExpired);
      if (activeItems.length === 0) {
        toast.warning("Tất cả sản phẩm trong giỏ hàng đều đã hết hạn sử dụng!");
        return;
      }

      // Kiểm tra xem có nhiều cửa hàng khác nhau không
      const allStoreKeys = Array.from(
        new Set(activeItems.map((i) => i.store?.id || i.store?.name))
      );

      if (allStoreKeys.length > 1) {
        toast.warning(
          "Website hiện chưa hỗ trợ thanh toán nhiều sản phẩm của các cửa hàng khác nhau trong cùng một đơn. Hệ thống đã chọn các sản phẩm của một cửa hàng để bạn thanh toán trước!",
          { duration: 5000 }
        );
        const firstStoreKey = allStoreKeys[0];
        const firstStoreItems = activeItems.filter(
          (i) => (i.store?.id || i.store?.name) === firstStoreKey
        );
        setSelectedItemIds(firstStoreItems.map((i) => i.id));
      } else {
        setSelectedItemIds(activeItems.map((i) => i.id));
      }
    } else {
      setSelectedItemIds([]);
    }
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    updateQuantity(id, quantity);
  };

  const requestDelete = (id: string) => {
    setDeleteItemId(id);
  };

  const confirmDelete = () => {
    if (deleteItemId) {
      removeItem(deleteItemId);
      setDeleteItemId(null);
    }
  };

  // 🟢 Lọc danh sách các sản phẩm đang được chọn
  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds]
  );

  // 🟢 Tính toán dữ liệu giỏ hàng đồng bộ CHỈ CHO CÁC SẢN PHẨM ĐƯỢC CHỌN
  const summaryData = useMemo<CartSummaryData>(() => {
    if (selectedItems.length === 0) {
      return { subTotal: 0, discount: 0, shippingFee: 0, tax: 0, total: 0 };
    }

    const subTotal = selectedItems.reduce(
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

    // Mặc định phí ship tạm tính 
    const defaultShippingPrice = SHIPPING_METHODS[0]?.price || 25000;
    let shippingFee = subTotal > 500000 || subTotal === 0 ? 0 : defaultShippingPrice;
    if (appliedVoucher?.code === "FREESHIP") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discountValue);
      discount = 0;
    }

    // Chính sách hỗ trợ: Nông sản sạch được miễn thuế VAT (0%), đồng bộ với trang thanh toán
    const tax = 0;
    const total = Math.max(0, subTotal + shippingFee + tax - discount);

    return { subTotal, discount, shippingFee, tax, total };
  }, [selectedItems, appliedVoucher]);

  const itemToDeleteName = useMemo(() => {
    return items.find((i) => i.id === deleteItemId)?.name;
  }, [deleteItemId, items]);

  // 🟢 Xử lý chuyển sang trang thanh toán: Truyền danh sách ID các món được chọn
  const handleProceedToCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán!");
      return;
    }

    // Kiểm tra an toàn trước khi chuyển sang thanh toán
    const selectedStores = Array.from(
      new Set(selectedItems.map((i) => i.store?.id || i.store?.name))
    );
    if (selectedStores.length > 1) {
      toast.warning(
        "Website hiện chưa hỗ trợ thanh toán nhiều sản phẩm của các cửa hàng khác nhau trong cùng một đơn. Vui lòng chọn và thanh toán sản phẩm của từng cửa hàng!",
        { duration: 5000 }
      );
      return;
    }

    router.push(`/thanh-toan?items=${selectedItemIds.join(",")}`);
  };

  // Giỏ hàng trống
  if (items.length === 0) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-12">
        <PageContainer>
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink isCurrentPage>Giỏ hàng</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <EmptyCart />
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12">
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
                <BreadcrumbLink isCurrentPage>Giỏ hàng</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 mt-4 mb-2 tracking-tight">
            Giỏ hàng của bạn
          </h1>
          <p className="text-gray-500 text-sm">
            Bạn đang có {items.length} sản phẩm trong giỏ hàng.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Cột trái: Danh sách món hàng */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CartList
              items={items}
              selectedItemIds={selectedItemIds}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={requestDelete}
            />
          </div>

          {/* Cột phải: Tóm tắt & Tiến hành thanh toán */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <VoucherBox
              appliedVoucher={appliedVoucher}
              onApplyVoucher={setAppliedVoucher}
            />

            <CartSummary
              data={summaryData}
              selectedCount={selectedItemIds.length}
              onCheckout={handleProceedToCheckout}
              onContinueShopping={() => router.push("/san-pham")}
            />
          </div>
        </div>
      </PageContainer>

      <DeleteConfirmModal
        isOpen={!!deleteItemId}
        onClose={() => setDeleteItemId(null)}
        onConfirm={confirmDelete}
        itemName={itemToDeleteName}
      />
    </div>
  );
}
