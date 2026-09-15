"use client";
import React, { ReactNode } from 'react';
import { SellerDashboardLayout } from '@/components/layout/DashboardLayout/SellerDashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard'; // <-- 1. Import bảo vệ vào

export default function SellerLayout({ children }: { children: ReactNode }) {
  return (
    // 2. Thuê bảo vệ canh cửa, chỉ cho phép thẻ "SELLER" đi qua
    <RoleGuard allowedRole="SELLER">
      <SellerDashboardLayout>
        {children}
      </SellerDashboardLayout>
    </RoleGuard>
  );
}