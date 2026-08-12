import { Metadata } from 'next';
import { AuthLayout, ForgotPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Quên mật khẩu | AgriMarket',
  description: 'Khôi phục mật khẩu tài khoản AgriMarket của bạn.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthLayout type="login" variant="centered">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
