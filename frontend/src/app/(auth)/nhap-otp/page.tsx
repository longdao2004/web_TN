import { Metadata } from 'next';
import { AuthLayout, OtpForm } from '@/components/auth';

export const metadata: Metadata = {
  title: 'Nhập mã OTP | AgriMarket',
  description: 'Xác thực tài khoản AgriMarket bằng mã OTP.',
};

export default function EnterOtpPage() {
  return (
    <AuthLayout type="login" variant="centered">
      <OtpForm />
    </AuthLayout>
  );
}
