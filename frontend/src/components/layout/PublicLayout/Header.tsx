"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Bell, Menu } from "lucide-react";
import { PageContainer } from "../core";
import { SearchBox, Button, Avatar, Dropdown } from "@/components/ui";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/auth.store";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  const totalItems = useCartStore((state) => state.totalItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const logout = useAuthStore((state) => state.logout);
  
  const router = useRouter();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
    if (isAuthenticated) {
      fetchUser();
      fetchCart();
    }
  }, [fetchCart, fetchUser, isAuthenticated]);

  const handleLogout = () => {
    logout();
    router.push("/dang-nhap");
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Menu di động */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--color-primary)]">
                AgriMarket
              </span>
            </Link>
          </div>

          {/* Điều hướng Desktop */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[var(--color-text-secondary)]">
            <Link
              href="/san-pham"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Sản phẩm
            </Link>
            <Link
              href="/cua-hang"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Cửa hàng
            </Link>
            <Link
              href="/gioi-thieu"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Giới thiệu
            </Link>
            <Link
              href="/tin-tuc"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Tin tức
            </Link>
            <Link
              href="/lien-he"
              className="hover:text-[var(--color-primary)] transition-colors"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Thanh tìm kiếm */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBox
              placeholder="Tìm kiếm nông sản, cửa hàng..."
              fullWidth
              onSearch={(val) => {
                if (val && val.trim()) {
                  // Chuyển hướng tới trang tìm kiếm tổng hợp (Global Search)
                  router.push(`/tim-kiem?q=${encodeURIComponent(val.trim())}`);
                }
              }}
            />
          </div>

          {/* Hành động của người dùng */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600"
              onClick={() => {
                // TODO: Implement notifications
              }}
            >
              <Bell className="h-5 w-5" />
            </Button>

            <Link href="/gio-hang">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-gray-600"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--color-primary)] text-[10px] font-bold text-white animate-in zoom-in duration-300">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Button>
            </Link>

            <div className="hidden sm:block ml-2 border-l border-gray-200 pl-4">
              {!isMounted ? (
                <div className="w-24 h-9 bg-gray-100 animate-pulse rounded-md"></div>
              ) : isAuthenticated ? (
                <Dropdown
                  align="right"
                  trigger={
                    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                      <span className="text-sm font-medium text-gray-700 hidden md:block">
                        {user?.fullName || "Tài khoản"}
                      </span>
                      <Avatar
                        src={user?.avatarUrl || ""}
                        fallback={user?.fullName?.charAt(0) || "U"}
                        size="sm"
                        className="ring-2 ring-transparent hover:ring-[var(--color-primary)] transition-all"
                      />
                    </div>
                  }
                  items={[
                    { label: "Tài khoản", onClick: () => router.push("/tai-khoan") },
                    { label: "Đơn hàng của tôi", onClick: () => router.push("/tai-khoan/don-hang") },
                    { label: "Đăng xuất", onClick: handleLogout },
                  ]}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => router.push("/dang-nhap")}>
                    Đăng nhập
                  </Button>
                  <Button size="sm" onClick={() => router.push("/dang-ky")}>
                    Đăng ký
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      {/* Menu thả xuống di động */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-white border-b border-[var(--color-border)] shadow-lg animate-in slide-in-from-top-2">
          <nav className="flex flex-col p-4 space-y-4 text-sm font-medium text-[var(--color-text-secondary)]">
            <Link
              href="/san-pham"
              className="hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sản phẩm
            </Link>
            <Link
              href="/cua-hang"
              className="hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Cửa hàng
            </Link>
            <Link
              href="/gioi-thieu"
              className="hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Giới thiệu
            </Link>
            <Link
              href="/tin-tuc"
              className="hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tin tức
            </Link>
            <Link
              href="/lien-he"
              className="hover:text-[var(--color-primary)] transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Liên hệ
            </Link>
            <div className="pt-4 border-t border-[var(--color-border)] flex flex-col space-y-4">
              {!isMounted ? null : isAuthenticated ? (
                <>
                  <Link
                    href="/tai-khoan"
                    className="hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {user?.fullName || "Tài khoản"}
                  </Link>
                  <Link
                    href="/tai-khoan/don-hang"
                    className="hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đơn hàng của tôi
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-left text-red-600 hover:text-red-700 transition-colors"
                  >
                    Đăng xuất
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/dang-nhap"
                    className="hover:text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng nhập
                  </Link>
                  <Link
                    href="/dang-ky"
                    className="text-[var(--color-primary)] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Đăng ký
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
