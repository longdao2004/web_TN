import { Metadata } from 'next';
import { AuthLayout, GoogleAuthMockForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Đăng nhập với Google | AgriMarket',
  description: 'Tiếp tục truy cập AgriMarket bằng tài khoản Google của bạn.',
};

export default function GoogleAuthPage() {
  return (
    <AuthLayout type="login" variant="centered">
      <GoogleAuthMockForm />
    </AuthLayout>
  );
}
