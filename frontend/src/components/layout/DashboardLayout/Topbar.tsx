"use client";
import React from "react";
import { Menu } from "lucide-react";
import {
  Avatar,
  Dropdown,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";
import { useRouter } from 'next/navigation';
import { useAuthStore } from "@/store/auth.store";
import { SellerNotificationPopover } from "./SellerNotificationPopover";
import { storeService } from '@/services/store.service';

interface TopbarProps {
  onToggleSidebar: () => void;
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}

export const Topbar = ({ onToggleSidebar, title, breadcrumb }: TopbarProps) => {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const [storeId, setStoreId] = React.useState<string | null>(null);

  // Chỉ lấy thông tin cửa hàng khi người dùng là SELLER
  React.useEffect(() => {
    if (user?.role === 'SELLER') {
      storeService.getMyStore()
        .then((store) => {
          if (store?.id) {
            setStoreId(store.id);
          }
        })
        .catch(() => {});
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // Phân chia menu theo vai trò (Role)
  const menuItems = React.useMemo(() => {
    if (user?.role === 'ADMIN') {
      return [
        { 
          label: "Trở về Trang chủ", 
          onClick: () => router.push("/") 
        },
        { 
          label: "Bảng điều khiển Quản trị", 
          onClick: () => router.push("/admin") 
        },
        { divider: true, label: "" },
        { 
          label: "Hồ sơ cá nhân", 
          onClick: () => router.push("/tai-khoan/ho-so") 
        },
        { divider: true, label: "" },
        { label: "Đăng xuất", danger: true, onClick: handleLogout }, 
      ];
    }

    // Menu dành cho SELLER
    return [
      { 
        label: "Trở về Trang chủ", 
        onClick: () => router.push("/") 
      },
      {
        label: "Xem gian hàng của tôi",
        onClick: () => router.push(storeId ? `/cua-hang/${storeId}` : "/cua-hang"),
      },
      { divider: true, label: "" },
      { 
        label: "Hồ sơ cá nhân", 
        onClick: () => router.push("/tai-khoan/ho-so") 
      },
      { 
        label: "Cài đặt Cửa hàng", 
        onClick: () => router.push("/seller/settings") 
      },
      { divider: true, label: "" },
      { label: "Đăng xuất", danger: true, onClick: handleLogout }, 
    ];
  }, [user?.role, storeId]);

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-border)] bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Nút bật/tắt menu trên mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h1>

          {/* Breadcrumb */}
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="hidden sm:block mt-1">
              <Breadcrumb>
                <BreadcrumbList className="text-xs">
                  {breadcrumb.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={item.href || "#"}
                          isCurrentPage={idx === breadcrumb.length - 1}
                        >
                          {item.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {idx < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Chuông thông báo động */}
        <SellerNotificationPopover />

        {/* User Menu */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer hover:ring-2 ring-[var(--color-primary)]/50 rounded-full transition-all">
              <Avatar src={user?.avatarUrl || ""} fallback={user?.fullName?.charAt(0) || (user?.role === 'ADMIN' ? 'AD' : 'U')} size="sm" />
            </div>
          }
          items={menuItems}
        />
      </div>
    </header>
  );
};