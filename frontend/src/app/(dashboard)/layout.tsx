import { AdminDashboardLayout } from '@/components/layout/DashboardLayout';
import { ReactNode } from 'react';

// Ghi chú: Dựa vào logic phân quyền (Auth Role), bạn có thể đổi AdminDashboardLayout
// thành BuyerDashboardLayout hoặc SellerDashboardLayout tương ứng.
// Hiện tại đang thiết lập mặc định là Admin để hiển thị.

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <AdminDashboardLayout>
      {children}
    </AdminDashboardLayout>
  );
}
