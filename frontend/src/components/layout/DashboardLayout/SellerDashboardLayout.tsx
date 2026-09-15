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
      label: "Thống kê", // Đáp ứng Mục 5
      href: "/seller",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Đơn hàng", // Đáp ứng Mục 4
      href: "/seller/orders",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Sản phẩm", // Đáp ứng Mục 2
      href: "/seller/products",
      icon: <Store className="h-5 w-5" />,
    },
    {
      label: "Lô hàng", // Đáp ứng Mục 3a
      href: "/seller/batches",
      icon: <Package className="h-5 w-5" />, // Tạm dùng icon Package, bạn có thể đổi icon khác
    },
    {
      label: "Chứng nhận", // Đáp ứng Mục 3b
      href: "/seller/certificates",
      icon: <Users className="h-5 w-5" />, // Sẽ đổi icon sau
    },
    {
      label: "Cửa hàng", // Đáp ứng Mục 1
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
