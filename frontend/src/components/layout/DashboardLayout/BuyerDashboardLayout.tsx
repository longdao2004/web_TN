import React, { ReactNode } from "react";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Settings,
  FileText,
} from "lucide-react";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export const BuyerDashboardLayout = ({ children }: { children: ReactNode }) => {
  const sidebarItems = [
    {
      label: "Tổng quan",
      href: "/buyer",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: true,
    },
    {
      label: "Đơn hàng của tôi",
      href: "/buyer/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      label: "Sản phẩm yêu thích",
      href: "/buyer/wishlist",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      label: "Sổ địa chỉ",
      href: "/buyer/addresses",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Cài đặt tài khoản",
      href: "/buyer/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <BaseDashboardLayout
      title="Bảng điều khiển khách hàng"
      brandName="AgriBuyer"
      sidebarItems={sidebarItems}
      breadcrumb={[
        { label: "Trang chủ", href: "/" },
        { label: "Tổng quan", href: "/buyer" },
      ]}
    >
      {children}
    </BaseDashboardLayout>
  );
};
