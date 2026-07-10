"use client";
import React, { useState, ReactNode } from "react";
import { Sidebar, SidebarItemProps } from "./Sidebar";
import { Topbar } from "./Topbar";
import { PageContainer } from "../core";

interface BaseDashboardLayoutProps {
  children: ReactNode;
  sidebarItems: SidebarItemProps[];
  title: string;
  breadcrumb?: { label: string; href?: string }[];
  brandName?: string;
}

export const BaseDashboardLayout = ({
  children,
  sidebarItems,
  title,
  breadcrumb,
  brandName,
}: BaseDashboardLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        items={sidebarItems}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        brandName={brandName}
      />

      <div className="flex flex-1 flex-col overflow-hidden w-full relative">
        <Topbar
          title={title}
          breadcrumb={breadcrumb}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <PageContainer
            fluid
            className="px-0 sm:px-0 lg:px-0 max-w-7xl mx-auto"
          >
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
};

