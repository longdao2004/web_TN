"use client";

import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Store, Package, BarChart3, Award, Settings, Layers } from "lucide-react";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export const SellerDashboardLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: "Thống kê",
      href: "/seller",
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: pathname === "/seller",
    },
    {
      label: "Đơn hàng",
      href: "/seller/orders",
      icon: <Package className="h-5 w-5" />,
      isActive: pathname.startsWith("/seller/orders"),
    },
    {
      label: "Sản phẩm",
      href: "/seller/products",
      icon: <Store className="h-5 w-5" />,
      isActive: pathname.startsWith("/seller/products"),
    },
    {
      label: "Lô hàng",
      href: "/seller/batches",
      icon: <Layers className="h-5 w-5" />,
      isActive: pathname.startsWith("/seller/batches"),
    },
    {
      label: "Chứng nhận",
      href: "/seller/certificates",
      icon: <Award className="h-5 w-5" />,
      isActive: pathname.startsWith("/seller/certificates"),
    },
    {
      label: "Cửa hàng",
      href: "/seller/settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname.startsWith("/seller/settings"),
    },
  ];

  const currentItem = sidebarItems.find((item) => item.isActive);
  const currentTitle = currentItem ? `Quản lý ${currentItem.label}` : "Quản lý Cửa hàng";

  return (
    <BaseDashboardLayout
      title={currentTitle}
      brandName="AgriSeller"
      sidebarItems={sidebarItems}
      breadcrumb={[
        { label: "Seller Center", href: "/seller" },
        { label: currentItem?.label || "Tổng quan" },
      ]}
    >
      {children}
    </BaseDashboardLayout>
  );
};
