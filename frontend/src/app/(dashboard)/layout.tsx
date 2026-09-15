import { ReactNode } from 'react';

// Layout gốc của Dashboard chỉ đóng vai trò truyền dữ liệu (children),
// giao diện cụ thể (Seller/Admin) sẽ được định nghĩa ở các layout con.
export default function DashboardRootLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
}