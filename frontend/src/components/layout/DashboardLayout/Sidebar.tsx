import React, { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/utils/cn";

export interface SidebarItemProps {
  label: string;
  href: string;
  icon: ReactNode;
  isActive?: boolean;
}

interface SidebarProps {
  items: SidebarItemProps[];
  isOpen: boolean;
  onToggle: () => void;
  brandName?: string;
  className?: string;
}

export const Sidebar = ({
  items,
  isOpen,
  onToggle,
  brandName = "AgriMarket",
  className,
}: SidebarProps) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white border-r border-[var(--color-border)] shadow-sm transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className,
        )}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center border-b border-[var(--color-border)] px-6">
          <Link
            href="/"
            className="text-xl font-bold text-[var(--color-primary)]"
          >
            {brandName}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                item.isActive
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-gray-100 hover:text-[var(--color-text-primary)]",
              )}
            >
              <div
                className={cn(item.isActive ? "text-white" : "text-gray-500")}
              >
                {item.icon}
              </div>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
};
