import React, { ReactNode } from "react";
import { cn } from "@/utils/cn";

interface PageContainerProps {
  children: ReactNode;
  className?: string;
  /** Nếu true, bỏ giới hạn max-width */
  fluid?: boolean;
}

/**
 * PageContainer: Bọc ngoài cùng nội dung của một trang.
 * Giới hạn max-width (thường là 1280px hoặc 1440px) và giữ nội dung căn giữa màn hình.
 */
export const PageContainer = ({
  children,
  className,
  fluid = false,
}: PageContainerProps) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-4 sm:px-6 lg:px-8",
        fluid ? "max-w-full" : "max-w-7xl", // max-w-7xl = 1280px
        className,
      )}
    >
      {children}
    </div>
  );
};
