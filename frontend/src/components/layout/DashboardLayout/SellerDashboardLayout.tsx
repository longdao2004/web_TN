import React, { ReactNode } from "react";
import { Store, Package, BarChart3, Users, Settings } from "lucide-react";
import { BaseDashboardLayout } from "./BaseDashboardLayout";

export const SellerDashboardLayout = ({
  children,
}: {
  children: ReactNode;
}) => {
  const sidebarItems = [
    {
      label: "Thống kê cửa hàng",
      href: "/seller",
      icon: <BarChart3 className="h-5 w-5" />,
      isActive: true,
    },
    {
      label: "Quản lý Đơn hàng",
      href: "/seller/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Quản lý Sản phẩm",
      href: "/seller/products",
      icon: <Store className="h-5 w-5" />,
    },
    {
      label: "Khách hàng",
      href: "/seller/customers",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Thiết lập cửa hàng",
      href: "/seller/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <BaseDashboardLayout
      title="Quản lý Cửa hàng"
      brandName="AgriSeller"
      sidebarItems={sidebarItems}
      breadcrumb={[
        { label: "Seller Center", href: "/seller" },
        { label: "Tổng quan" },
      ]}
    >
      {children}
    </BaseDashboardLayout>
  );
};
