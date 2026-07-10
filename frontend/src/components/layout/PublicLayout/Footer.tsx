import React from "react";
import Link from "next/link";
import { PageContainer } from "../core";

export const Footer = () => {
  return (
    <footer className="w-full border-t border-[var(--color-border)] bg-gray-50 pt-16 pb-8">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Cột 1: Thông tin công ty */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-[var(--color-primary)]">
                AgriMarket
              </span>
            </Link>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Nền tảng thương mại điện tử chuyên cung cấp nông sản sạch, đạt
              chuẩn chất lượng từ các trang trại trên toàn quốc.
            </p>
          </div>

          {/* Cột 2: Liên kết */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Về chúng tôi
            </h4>
            <nav className="flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
              <Link href="/about" className="hover:text-[var(--color-primary)]">
                Giới thiệu
              </Link>
              <Link
                href="/careers"
                className="hover:text-[var(--color-primary)]"
              >
                Tuyển dụng
              </Link>
              <Link href="/news" className="hover:text-[var(--color-primary)]">
                Tin tức
              </Link>
            </nav>
          </div>

          {/* Cột 3: Hỗ trợ */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Hỗ trợ khách hàng
            </h4>
            <nav className="flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
              <Link href="/faq" className="hover:text-[var(--color-primary)]">
                Trung tâm trợ giúp
              </Link>
              <Link
                href="/shipping"
                className="hover:text-[var(--color-primary)]"
              >
                Chính sách giao hàng
              </Link>
              <Link
                href="/returns"
                className="hover:text-[var(--color-primary)]"
              >
                Chính sách đổi trả
              </Link>
            </nav>
          </div>

          {/* Cột 4: Liên hệ */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Liên hệ
            </h4>
            <ul className="flex flex-col gap-2 text-sm text-[var(--color-text-secondary)]">
              <li>Hotline: 1900 xxxx</li>
              <li>Email: support@agrimarket.vn</li>
              <li>Địa chỉ: Khu phố 6, Linh Trung, Thủ Đức, TP.HCM</li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[var(--color-text-secondary)]">
            &copy; {new Date().getFullYear()} AgriMarket. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
            <Link href="/terms" className="hover:text-[var(--color-primary)]">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-[var(--color-primary)]">
              Bảo mật
            </Link>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
};
