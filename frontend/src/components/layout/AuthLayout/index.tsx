import React, { ReactNode } from "react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 sm:p-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/">
            <span className="text-3xl font-bold text-[var(--color-primary)]">
              AgriMarket
            </span>
          </Link>
        </div>

        {/* Form Container */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-xl sm:p-10">
          {children}
        </div>

        {/* Small Footer */}
        <div className="mt-8 text-center text-sm text-[var(--color-text-secondary)]">
          <p>
            &copy; {new Date().getFullYear()} AgriMarket. All rights reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4">
            <Link href="/terms" className="hover:text-[var(--color-primary)]">
              Điều khoản
            </Link>
            <Link href="/privacy" className="hover:text-[var(--color-primary)]">
              Bảo mật
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
