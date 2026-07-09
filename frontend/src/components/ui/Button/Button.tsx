// Chứa UI logic
import React, { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/utils/cn";
import { ButtonProps } from "./Button.types";

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      leftIcon,
      rightIcon,
      children,
      fullWidth,
      ...props
    },
    ref,
  ) => {
    // Các class cơ bản áp dụng cho mọi Button
    const baseClasses =
      "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]/20 disabled:pointer-events-none disabled:bg-gray-200 disabled:text-[var(--color-disabled)] active:scale-[0.98] select-none";

    // Cấu hình class theo Variant (Chuẩn Design System)
    const variants = {
      primary:
        "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] shadow-sm",
      secondary:
        "bg-[var(--color-primary-light)] text-[var(--color-primary-hover)] hover:bg-[#C6F6D5]",
      outline:
        "border border-[var(--color-border)] bg-transparent hover:bg-[var(--color-bg)] text-[var(--color-text-primary)]",
      ghost:
        "bg-transparent hover:bg-gray-100 text-[var(--color-text-primary)]",
      danger: "bg-[var(--color-danger)] text-white hover:bg-red-600 shadow-sm",
      success:
        "bg-[var(--color-success)] text-white hover:bg-emerald-600 shadow-sm",
    };

    // Cấu hình class theo Kích thước
    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-10 px-4 py-2 text-sm",
      lg: "h-12 px-6 text-base",
      icon: "h-10 w-10", // Hình vuông chuẩn cho button icon
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          fullWidth ? "w-full" : "",
          className,
        )}
        {...props}
      >
        {/* Spinner nếu đang loading */}
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

        {/* Icon trái */}
        {!isLoading && leftIcon && (
          <span className="mr-2 flex items-center">{leftIcon}</span>
        )}

        {/* Nội dung text */}
        {children}

        {/* Icon phải */}
        {!isLoading && rightIcon && (
          <span className="ml-2 flex items-center">{rightIcon}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";
