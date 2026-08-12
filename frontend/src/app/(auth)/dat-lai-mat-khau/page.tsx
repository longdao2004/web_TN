import { Metadata } from 'next';
import { AuthLayout, ResetPasswordForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Đặt lại mật khẩu | AgriMarket',
  description: 'Tạo mật khẩu mới cho tài khoản AgriMarket của bạn.',
};

export default function ResetPasswordPage() {
  return (
    <AuthLayout type="login" variant="centered">
      <ResetPasswordForm />
    </AuthLayout>
  );
}
