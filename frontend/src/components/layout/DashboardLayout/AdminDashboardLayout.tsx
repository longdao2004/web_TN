"use client";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Store,
  Tags,
  ShoppingBag,
} from "lucide-react";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();

  const sidebarItems = [
    {
      label: "Tổng quan",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: pathname === "/admin",
    },
    {
      label: "Quản lý Người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      isActive: pathname.startsWith("/admin/users"),
    },
    {
      label: "Quản lý Cửa hàng",
      href: "/admin/stores",
      icon: <Store className="h-5 w-5" />,
      isActive: pathname.startsWith("/admin/stores"),
    },
    {
      label: "Danh mục Nông sản",
      href: "/admin/categories",
      icon: <Tags className="h-5 w-5" />,
      isActive: pathname.startsWith("/admin/categories"),
    },
    {
      label: "Giám sát Đơn hàng",
      href: "/admin/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      isActive: pathname.startsWith("/admin/orders"),
    },
  ];

  const currentItem = sidebarItems.find((item) => item.isActive);
  const currentTitle = currentItem ? currentItem.label : "Quản trị Hệ thống";

  return (
    <BaseDashboardLayout
      title={currentTitle}
      brandName="AgriAdmin"
      sidebarItems={sidebarItems}
      breadcrumb={[
        { label: "Admin", href: "/admin" },
        { label: currentItem?.label || "Tổng quan" },
      ]}
    >
      {children}
    </BaseDashboardLayout>
  );
};