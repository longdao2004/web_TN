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

  // Tính toán dữ liệu giỏ hàng đồng bộ 100%
  const summaryData = useMemo<CartSummaryData>(() => {
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

    // Mặc định phí ship tạm tính 30.000đ
    let shippingFee = subTotal > 500000 || subTotal === 0 ? 0 : 30000;
    if (appliedVoucher?.code === "FREESHIP") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discountValue);
      discount = 0;
    }

    const tax = Math.round(subTotal * 0.08); // 8% VAT
    const total = Math.max(0, subTotal + shippingFee + tax - discount);

    return { subTotal, discount, shippingFee, tax, total };
  }, [items, appliedVoucher]);

  const itemToDeleteName = useMemo(() => {
    return items.find((i) => i.id === deleteItemId)?.name;
  }, [deleteItemId, items]);

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
              selectedItemIds={items.map((i) => i.id)}
              onSelectAll={() => {}}
              onSelectItem={() => {}}
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
              selectedCount={items.length}
              onCheckout={() => router.push("/thanh-toan")}
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