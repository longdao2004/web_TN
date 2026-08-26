"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, MapPin, ShoppingBag, LogOut, Star } from "lucide-react";
import { PageContainer } from "@/components/layout/core";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui/Breadcrumb/Breadcrumb";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

const SIDEBAR_ITEMS = [
  {
    name: "Hồ sơ cá nhân",
    href: "/tai-khoan/ho-so",
    icon: User,
  },
  {
    name: "Đơn hàng của tôi",
    href: "/tai-khoan/don-hang",
    icon: ShoppingBag,
  },
  {
    name: "Đánh giá của tôi",
    href: "/tai-khoan/danh-gia",
    icon: Star,
  },
  {
    name: "Địa chỉ nhận hàng",
    href: "/tai-khoan/dia-chi",
    icon: MapPin,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { token, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.push("/dang-nhap");
    }
  }, [mounted, token, router]);

  if (!mounted || !token) return null;

  const handleLogout = () => {
    logout();
    toast.success("Đăng xuất thành công");
    router.push("/dang-nhap");
  };

  return (
    <PageContainer className="py-8">
      {/* Đường dẫn (Breadcrumb) */}
      <Breadcrumb className="mb-8">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/tai-khoan/ho-so" isCurrentPage>
              Tài khoản
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] overflow-hidden">
            <div className="p-4 border-b border-[var(--color-border)]">
              <h2 className="font-semibold text-lg text-[var(--color-text-primary)]">
                Quản lý tài khoản
              </h2>
            </div>
            <nav className="p-2 space-y-1">
              {SIDEBAR_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[var(--color-primary)]/10 text-[var(--color-primary)] font-medium"
                        : "text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)]"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-red-600 hover:bg-red-50 font-medium"
              >
                <LogOut className="h-5 w-5" />
                Đăng xuất
              </button>
            </nav>
          </div>
        </div>

        {/* Nội dung chính */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </PageContainer>
  );
}
