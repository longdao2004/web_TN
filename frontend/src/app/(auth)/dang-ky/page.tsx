import { Metadata } from 'next';
import { AuthLayout, RegisterForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Đăng ký | AgriMarket',
  description: 'Tạo tài khoản để bắt đầu mua sắm nông sản sạch.',
};

export default function RegisterPage() {
  return (
    <AuthLayout type="register">
      <RegisterForm />
    </AuthLayout>
  );
}
