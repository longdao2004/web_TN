import React from 'react';
import { Metadata } from 'next';
import { AuthLayout, LoginForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Đăng nhập | AgriMarket',
  description: 'Đăng nhập vào hệ thống AgriMarket để trải nghiệm mua sắm nông sản sạch.',
};

export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
