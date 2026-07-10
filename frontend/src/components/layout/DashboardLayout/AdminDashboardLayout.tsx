import React, { ReactNode } from "react";
import {
  LayoutDashboard,
  Users,
  Store,
  Tags,
  ShieldCheck,
  Settings,
} from "lucide-react";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export const AdminDashboardLayout = ({ children }: { children: ReactNode }) => {
  const sidebarItems = [
    {
      label: "Tổng quan",
      href: "/admin",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: true,
    },
    {
      label: "Quản lý Người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Quản lý Cửa hàng",
      href: "/admin/stores",
      icon: <Store className="h-5 w-5" />,
    },
    {
      label: "Danh mục Hệ thống",
      href: "/admin/categories",
      icon: <Tags className="h-5 w-5" />,
    },
    {
      label: "Kiểm duyệt",
      href: "/admin/approvals",
      icon: <ShieldCheck className="h-5 w-5" />,
    },
    {
      label: "Cài đặt Hệ thống",
      href: "/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <BaseDashboardLayout
      title="Admin Dashboard"
      brandName="AgriAdmin"
      sidebarItems={sidebarItems}
      breadcrumb={[{ label: "Admin", href: "/admin" }, { label: "Tổng quan" }]}
    >
      {children}
    </BaseDashboardLayout>
  );
};
