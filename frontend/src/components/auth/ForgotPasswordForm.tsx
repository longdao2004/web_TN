'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { authService } from '@/services/auth.service';

export const ForgotPasswordForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const validateEmail = (email: string) => {
    if (!email) return 'Vui lòng nhập email.';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Vui lòng nhập địa chỉ email hợp lệ.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailError = validateEmail(email);

    if (emailError) {
      setError(emailError);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await authService.forgotPassword({ email });
      setIsSuccess(true);
    } catch (error: any) {
      setError(error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) {
      setError('');
    }
  };

  if (isSuccess) {
    return (
      <div className="text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Kiểm tra email của bạn</h2>
        <p className="mt-4 text-gray-600 leading-relaxed">
          Chúng tôi đã gửi một liên kết khôi phục mật khẩu. <br className="hidden sm:block" />
          Vui lòng kiểm tra hộp thư đến (hoặc thư mục rác) của email:
        </p>
        <p className="mt-2 text-sm font-bold text-emerald-600">
          {email}
        </p>
        
        <div className="mt-8">
          <Link href="/dang-nhap">
            <Button variant="outline" className="w-full">
              Quay lại Đăng nhập
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Quên mật khẩu?</h2>
        <p className="mt-2 text-gray-600">
          Nhập email đã đăng ký để nhận liên kết khôi phục mật khẩu.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
              autoComplete="email"
              placeholder="Nhập địa chỉ email..."
              value={email}
              onChange={handleChange}
              className={`pl-10 ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              aria-invalid={!!error}
              aria-describedby={error ? 'email-error' : undefined}
            />
          </div>
          {error && (
            <p id="email-error" className="text-sm text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium rounded-xl shadow-sm hover:shadow"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang gửi liên kết...
            </span>
          ) : (
            'Gửi liên kết khôi phục'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center">
        <Link 
          href="/dang-nhap" 
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại đăng nhập
        </Link>
      </div>
    </div>
  );
};
