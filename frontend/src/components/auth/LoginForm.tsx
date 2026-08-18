'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Checkbox } from '../ui/Checkbox';
import { PasswordInput } from './PasswordInput';
import { SocialLogin } from './SocialLogin';
import { AuthDivider } from './AuthDivider';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';

import { toast } from 'sonner';

export const LoginForm = () => {
  const router = useRouter();
  const setToken = useAuthStore((state) => state.setToken);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  });

  const validateEmail = (email: string) => {
    if (!email) return 'Email không được để trống';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Email không đúng định dạng';
    return '';
  };

  const validatePassword = (password: string) => {
    if (!password) return 'Mật khẩu không được để trống';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setErrors({ email: '', password: '' });
    setIsLoading(true);

    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Lưu token
      setToken(response.accessToken);

      toast.success('Đăng nhập thành công!', {
        description: 'Chào mừng bạn trở lại với AgriMarket.'
      });
      
      // Giữ nguyên behavior redirect hiện tại
      router.push('/');
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        toast.error('Email hoặc mật khẩu không chính xác.');
      } else {
        toast.error('Đăng nhập thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Đăng nhập</h2>
        <p className="mt-2 text-gray-600">
          Đăng nhập để tiếp tục mua sắm các sản phẩm nông nghiệp sạch.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Nhập địa chỉ email..."
              value={formData.email}
              onChange={handleChange}
              className={`pl-10 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              aria-invalid={!!errors.email}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
          </div>
          {errors.email && (
            <p id="email-error" className="text-sm text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <PasswordInput
              id="password"
              name="password"
              placeholder="Nhập mật khẩu..."
              value={formData.password}
              onChange={handleChange}
              className={`pl-10 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? 'password-error' : undefined}
            />
          </div>
          {errors.password && (
            <p id="password-error" className="text-sm text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              name="remember"
              checked={formData.remember}
              onChange={handleChange}
            />
            <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
              Ghi nhớ đăng nhập
            </label>
          </div>
          <Link
            href="/quen-mat-khau"
            className="text-sm font-medium text-emerald-600 hover:text-emerald-500 hover:underline transition-colors"
          >
            Quên mật khẩu?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium rounded-xl shadow-sm hover:shadow"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang đăng nhập...
            </span>
          ) : (
            'Đăng nhập'
          )}
        </Button>
      </form>

      <AuthDivider />

      <SocialLogin />

      <div className="mt-8 text-center text-sm text-gray-600">
        Chưa có tài khoản?{' '}
        <Link
          href="/dang-ky"
          className="font-medium text-emerald-600 hover:text-emerald-500 hover:underline transition-colors"
        >
          Đăng ký ngay
        </Link>
      </div>
    </div>
  );
};
