import React, { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface ContentWrapperProps {
  children: ReactNode;
  className?: string;
  /** Đóng hộp nội dung với nền trắng, bo góc, bóng đổ */
  boxed?: boolean;
}

/**
 * ContentWrapper: Bọc các nhóm nội dung nhỏ, tạo khoảng cách hợp lý.
 */
export const ContentWrapper = ({
  children,
  className,
  boxed = false,
}: ContentWrapperProps) => {
  return (
    <div
      className={cn(
        "w-full",
        boxed &&
          "rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
