import React, { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/utils/cn";

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  /** Background color (mặc định trong suốt) */
  bgClass?: string;
}

/**
 * Section: Định dạng khoảng cách (padding dọc) cho các phần lớn trong trang.
 */
export const Section = ({
  children,
  className,
  bgClass,
  ...props
}: SectionProps) => {
  return (
    <section
      className={cn("py-12 md:py-16 lg:py-20 w-full", bgClass, className)}
      {...props}
    >
      {children}
    </section>
  );
};
