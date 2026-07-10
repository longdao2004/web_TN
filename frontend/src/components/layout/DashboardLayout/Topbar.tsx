import React from "react";
import { Menu, Bell } from "lucide-react";
import {
  Button,
  Avatar,
  Dropdown,
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "@/components/ui";

interface TopbarProps {
  onToggleSidebar: () => void;
  title: string;
  breadcrumb?: { label: string; href?: string }[];
}

export const Topbar = ({ onToggleSidebar, title, breadcrumb }: TopbarProps) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-[var(--color-border)] bg-white px-4 sm:px-6">
      <div className="flex items-center gap-4">
        {/* Nút bật/tắt menu trên mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none"
        >
          <Menu className="h-6 w-6" />
        </button>

        <div className="flex flex-col">
          <h1 className="text-lg font-semibold text-[var(--color-text-primary)]">
            {title}
          </h1>

          {/* Breadcrumb Tùy chọn */}
          {breadcrumb && breadcrumb.length > 0 && (
            <div className="hidden sm:block mt-1">
              <Breadcrumb>
                <BreadcrumbList className="text-xs">
                  {breadcrumb.map((item, idx) => (
                    <React.Fragment key={idx}>
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={item.href || "#"}
                          isCurrentPage={idx === breadcrumb.length - 1}
                        >
                          {item.label}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                      {idx < breadcrumb.length - 1 && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-gray-500 hover:text-gray-900"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </Button>

        {/* User Menu */}
        <Dropdown
          align="right"
          trigger={
            <div className="flex items-center gap-2 cursor-pointer hover:ring-2 ring-[var(--color-primary)]/50 rounded-full transition-all">
              <Avatar fallback="NV" size="sm" />
            </div>
          }
          items={[
            { label: "Hồ sơ", onClick: () => console.log("profile") },
            { label: "Cài đặt" },
            { divider: true, label: "" },
            { label: "Đăng xuất", danger: true },
          ]}
        />
      </div>
    </header>
  );
};
