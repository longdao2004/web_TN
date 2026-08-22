"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Bell, Menu } from "lucide-react";
import { PageContainer } from "../core";
import { SearchBox, Button, Avatar, Dropdown } from "@/components/ui";
import { useCartStore } from "@/store/useCartStore";

export const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const totalItems = useCartStore((state) => state.totalItems);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const router = useRouter();

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--color-border)] bg-white/80 backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo & Mobile Menu */}
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

          {/* Desktop Navigation */}
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

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <SearchBox
              placeholder="Tìm kiếm nông sản..."
              fullWidth
              onSearch={(val) => {
                if (val && val.trim()) {
                  router.push(`/tim-kiem?q=${encodeURIComponent(val.trim())}`);
                }
              }}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
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
              {/* UI Mock state for authenticated user (currently false) */}
              {false ? (
                <Dropdown
                  align="right"
                  trigger={
                    <Avatar
                      fallback="User"
                      size="sm"
                      className="cursor-pointer hover:ring-2 ring-[var(--color-primary)] transition-all"
                    />
                  }
                  items={[
                    { label: "Tài khoản", onClick: () => router.push("/tai-khoan") },
                    { label: "Đăng xuất" },
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

      {/* Mobile Menu Dropdown */}
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
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
