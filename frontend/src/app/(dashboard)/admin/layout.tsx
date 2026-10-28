"use client";
import React, { ReactNode } from "react";
import { AdminDashboardLayout } from "@/components/layout/DashboardLayout/AdminDashboardLayout";
import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <RoleGuard allowedRole="ADMIN">
      <AdminDashboardLayout>{children}</AdminDashboardLayout>
    </RoleGuard>
  );
}