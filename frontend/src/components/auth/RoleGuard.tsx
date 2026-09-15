"use client";
import React, { useEffect, useState } from 'react'; // Bổ sung import useState
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types/user';
import { Loader2 } from 'lucide-react';

export const RoleGuard = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: Role }) => {
  const router = useRouter();
  // Lấy thêm thông tin người dùng từ store, bao gồm role và token
  const { user, token, fetchUser } = useAuthStore();
  
  // 1. Khai báo biến kiểm tra môi trường Client
  const [isMounted, setIsMounted] = useState(false);

  // 2. Chạy một lần duy nhất khi vừa load lên Trình duyệt
  useEffect(() => {
    setIsMounted(true);
    // Nếu có thẻ Token nhưng chưa có thông tin User -> Tự gọi Backend lấy về!
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  useEffect(() => {
    // Nếu chưa load xong Client thì chưa thèm làm gì cả
    if (!isMounted) return;

    if (!token) {
      router.push('/dang-nhap');
      return;
    }
    if (user && user.role !== allowedRole) {
      router.push('/');
    }
  }, [user, token, router, allowedRole, isMounted]);

  // 3. TRỌNG TÂM: Nếu chưa Mounted, trả về null để khớp hoàn toàn với Server
  if (!isMounted) {
    return null;
  }

  // 4. Các bước sau diễn ra bình thường trên Trình duyệt
  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (user && user.role === allowedRole) {
    return <>{children}</>;
  }

  return null;
};