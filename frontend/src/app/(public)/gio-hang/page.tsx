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
import { CartSummaryData } from "@/types/cart";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import {
  CartList,
  CartSummary,
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

  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  // 🟢 Tự động khởi tạo khi tải giỏ hàng: Chọn tất cả các món chưa hết hạn
  useEffect(() => {
    if (items.length > 0) {
      setSelectedItemIds((prev) => {
        // Chỉ giữ lại các món còn tồn tại VÀ chưa hết hạn
        const validPrev = prev.filter((id) =>
          items.some((item) => item.id === id && !item.isExpired)
        );
        if (validPrev.length > 0) return validPrev;

        // Nếu chưa chọn món nào: Mặc định chọn tất cả sản phẩm còn hạn của giỏ
        const activeItems = items.filter((i) => !i.isExpired);
        return activeItems.map((i) => i.id);
      });
    } else {
      setSelectedItemIds([]);
    }
  }, [items]);

  // 🟢 Lọc danh sách các sản phẩm đang được chọn
  const selectedItems = useMemo(
    () => items.filter((item) => selectedItemIds.includes(item.id)),
    [items, selectedItemIds]
  );

  // 🟢 Lấy danh sách tên các gian hàng đang được chọn để hiển thị ở tóm tắt đơn hàng
  const selectedStoreNames = useMemo(() => {
    const names = new Set<string>();
    for (const item of selectedItems) {
      if (item.store?.name) names.add(item.store.name);
    }
    return Array.from(names);
  }, [selectedItems]);

  const selectedStoreName = useMemo(() => {
    if (selectedStoreNames.length === 0) return undefined;
    if (selectedStoreNames.length === 1) return selectedStoreNames[0];
    return `${selectedStoreNames.length} gian hàng (${selectedStoreNames.join(", ")})`;
  }, [selectedStoreNames]);

  // 🟢 Xử lý khi người dùng tích chọn / bỏ chọn từng sản phẩm (Hỗ trợ chọn nhiều gian hàng cùng lúc)
  const handleSelectItem = (id: string, selected: boolean) => {
    const targetItem = items.find((i) => i.id === id);
    if (!targetItem) return;

    // Chặn người dùng nếu cố tích chọn sản phẩm đã hết hạn
    if (targetItem.isExpired) {
      toast.error("Sản phẩm này đã hết hạn sử dụng, vui lòng xóa khỏi giỏ hàng!");
      return;
    }

    if (selected) {
      // Thêm sản phẩm vào danh sách chọn (cho phép tự do chọn sản phẩm từ nhiều gian hàng khác nhau)
      setSelectedItemIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    } else {
      setSelectedItemIds((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  // 🟢 Xử lý chọn hoặc bỏ chọn toàn bộ sản phẩm của một gian hàng cụ thể
  const handleSelectStore = (storeKey: string, selected: boolean) => {
    const storeActiveItems = items.filter(
      (i) => (i.store?.id || i.store?.name) === storeKey && !i.isExpired
    );
    const storeItemIds = storeActiveItems.map((i) => i.id);

    if (selected) {
      // Tích chọn thêm toàn bộ sản phẩm của gian hàng này mà không làm mất sản phẩm của gian hàng khác
      setSelectedItemIds((prev) => Array.from(new Set([...prev, ...storeItemIds])));
      const storeName = storeActiveItems[0]?.store?.name || "gian hàng";
      toast.success(`Đã chọn toàn bộ sản phẩm của ${storeName}.`);
    } else {
      // Bỏ chọn các sản phẩm của riêng gian hàng này
      setSelectedItemIds((prev) => prev.filter((id) => !storeItemIds.includes(id)));
    }
  };

  // 🟢 Mua nhanh toàn bộ sản phẩm khả dụng của một gian hàng cụ thể
  const handleCheckoutStore = (storeKey: string) => {
    const storeActiveItems = items.filter(
      (i) => (i.store?.id || i.store?.name) === storeKey && !i.isExpired
    );

    if (storeActiveItems.length === 0) {
      toast.warning("Gian hàng này không có sản phẩm khả dụng để thanh toán!");
      return;
    }

    const ids = storeActiveItems.map((i) => i.id);
    setSelectedItemIds(ids);
    router.push(`/thanh-toan?items=${ids.join(",")}`);
  };

  // 🟢 Xử lý khi người dùng bấm "Chọn tất cả" sản phẩm của tất cả các gian hàng
  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      // Chỉ xét các món chưa hết hạn
      const activeItems = items.filter((i) => !i.isExpired);
      if (activeItems.length === 0) {
        toast.warning("Tất cả sản phẩm trong giỏ hàng đều đã hết hạn sử dụng!");
        return;
      }
      setSelectedItemIds(activeItems.map((i) => i.id));
      toast.success(`Đã chọn tất cả ${activeItems.length} sản phẩm khả dụng.`);
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

  // 🟢 Tính toán dữ liệu giỏ hàng đồng bộ CHỈ CHO CÁC SẢN PHẨM ĐƯỢC CHỌN (Hỗ trợ Đa gian hàng)
  const summaryData = useMemo<CartSummaryData>(() => {
    if (selectedItems.length === 0) {
      return { subTotal: 0, discount: 0, shippingFee: 0, tax: 0, total: 0 };
    }

    const subTotal = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const discount = 0; // Đã bỏ mục mã khuyến mãi
    // Đếm số lượng gian hàng có sản phẩm được chọn (Mỗi gian hàng có chuyến vận chuyển riêng biệt)
    const uniqueStoreCount = new Set(
      selectedItems.map((i) => i.store?.id || i.store?.name)
    ).size;
    const baseShippingPrice = SHIPPING_METHODS[0]?.price || 25000;
    // Miễn phí vận chuyển nếu đơn > 500.000đ, ngược lại tính theo số lượng gian hàng
    const shippingFee =
      subTotal > 500000 || subTotal === 0 ? 0 : baseShippingPrice * uniqueStoreCount;

    // Chính sách hỗ trợ: Nông sản sạch được miễn thuế VAT (0%), đồng bộ với trang thanh toán
    const tax = 0;
    const total = subTotal + shippingFee;

    return { subTotal, discount, shippingFee, tax, total };
  }, [selectedItems]);

  const itemToDeleteName = useMemo(() => {
    return items.find((i) => i.id === deleteItemId)?.name;
  }, [deleteItemId, items]);

  // 🟢 Xử lý chuyển sang trang thanh toán: Truyền danh sách ID các món được chọn (Cho phép nhiều gian hàng)
  const handleProceedToCheckout = () => {
    if (selectedItemIds.length === 0) {
      toast.warning("Vui lòng chọn ít nhất 1 sản phẩm để tiến hành thanh toán!");
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
              onSelectStore={handleSelectStore}
              onCheckoutStore={handleCheckoutStore}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={requestDelete}
            />
          </div>

          {/* Cột phải: Tóm tắt & Tiến hành thanh toán */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <CartSummary
              data={summaryData}
              selectedCount={selectedItemIds.length}
              selectedStoreName={selectedStoreName}
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
