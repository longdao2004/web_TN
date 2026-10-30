"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types/user';
import { Loader2 } from 'lucide-react';

export const RoleGuard = ({ children, allowedRole }: { children: React.ReactNode, allowedRole: Role }) => {
  const router = useRouter();
  const { user, token, fetchUser } = useAuthStore();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (token && !user) {
      fetchUser();
    }
  }, [token, user, fetchUser]);

  useEffect(() => {
    if (!isMounted) return;

    if (!token) {
      router.push('/dang-nhap');
      return;
    }

    // Phân quyền chặt chẽ theo vai trò
    if (user && user.role !== allowedRole) {
      if (user.role === 'ADMIN') {
        router.push('/admin');
      } else if (user.role === 'SELLER') {
        router.push('/seller');
      } else {
        router.push('/');
      }
    }
  }, [user, token, router, allowedRole, isMounted]);

  if (!isMounted) {
    return null;
  }

  if (token && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  // Chỉ cho phép người dùng có đúng vai trò được render giao diện
  if (user && user.role === allowedRole) {
    return <>{children}</>;
  }

  return null;
};