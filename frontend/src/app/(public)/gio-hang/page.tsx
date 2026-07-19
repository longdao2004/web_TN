"use client";
import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";
import { CartItem as ICartItem, Voucher, CartSummaryData } from "@/types/cart";
import { useCartStore } from "@/store/useCartStore";
import {
  CartList,
  CartSummary,
  VoucherBox,
  EmptyCart,
  DeleteConfirmModal,
} from "@/components/cart";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem } = useCartStore();

  // State
  const [selectedIds, setSelectedIds] = useState<string[]>(
    items.map((i) => i.id),
  );
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);

  // Modal State
  const [deleteItemId, setDeleteItemId] = useState<string | null>(null);

  // Handlers
  const handleSelectAll = (selected: boolean) => {
    setSelectedIds(selected ? items.map((i) => i.id) : []);
  };

  const handleSelectItem = (id: string, selected: boolean) => {
    if (selected) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((itemId) => itemId !== id));
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
      setSelectedIds((prev) => prev.filter((id) => id !== deleteItemId));
      setDeleteItemId(null);
    }
  };

  // Calculations
  const summaryData = useMemo<CartSummaryData>(() => {
    const selectedItems = items.filter((item) => selectedIds.includes(item.id));
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

    // Default shipping logic: freeship > 500k, else 30k (unless voucher gives freeship)
    let shippingFee = subTotal > 500000 || subTotal === 0 ? 0 : 30000;
    if (appliedVoucher?.code === "FREESHIP") {
      shippingFee = Math.max(0, shippingFee - appliedVoucher.discountValue);
      // Fixed logic: the FREESHIP voucher in mock says max 30k. So it basically covers the 30k fee.
      discount = 0; // Move discount to shipping offset for simplicity, or just keep it as discount
    }

    const tax = Math.round(subTotal * 0.08); // 8% VAT
    const total = Math.max(0, subTotal + shippingFee + tax - discount);

    return { subTotal, discount, shippingFee, tax, total };
  }, [items, selectedIds, appliedVoucher]);

  const itemToDeleteName = useMemo(() => {
    return items.find((i) => i.id === deleteItemId)?.name;
  }, [deleteItemId, items]);

  // View
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
        {/* Breadcrumb */}
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
          {/* Main Content: Cart List */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <CartList
              items={items}
              selectedItemIds={selectedIds}
              onSelectAll={handleSelectAll}
              onSelectItem={handleSelectItem}
              onUpdateQuantity={handleUpdateQuantity}
              onDeleteItem={requestDelete}
            />
          </div>

          {/* Sidebar: Summary & Vouchers */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <VoucherBox
              appliedVoucher={appliedVoucher}
              onApplyVoucher={setAppliedVoucher}
            />

            <CartSummary
              data={summaryData}
              selectedCount={selectedIds.length}
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
