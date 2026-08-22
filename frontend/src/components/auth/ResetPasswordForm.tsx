'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Lock } from 'lucide-react';
import { Button } from '../ui/Button';
import { PasswordInput } from './PasswordInput';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

const ResetPasswordFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const evaluatePasswordStrength = (password: string) => {
    if (!password) return { score: 0, label: '', color: 'bg-gray-200' };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    if (score <= 2) return { score: 1, label: 'Yếu', color: 'bg-red-500' };
    if (score === 3 || score === 4) return { score: 2, label: 'Trung bình', color: 'bg-yellow-500' };
    return { score: 3, label: 'Mạnh', color: 'bg-emerald-500' };
  };

  const strength = evaluatePasswordStrength(formData.password);

  const validate = () => {
    let isValid = true;
    const newErrors = { password: '', confirmPassword: '' };

    if (!token) {
      toast.error('Lỗi', {
        description: 'Token không hợp lệ hoặc không được cung cấp.'
      });
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = 'Vui lòng nhập mật khẩu mới.';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự.';
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu.';
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp.';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;

    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword: formData.password,
      });

      toast.success('Đặt lại mật khẩu thành công!', {
        description: 'Mật khẩu của bạn đã được cập nhật. Vui lòng đăng nhập lại.',
        action: {
          label: 'Đăng nhập ngay',
          onClick: () => router.push('/dang-nhap'),
        },
      });
      router.push('/dang-nhap');
    } catch (error: any) {
      toast.error('Đặt lại mật khẩu thất bại', {
        description: error.message || 'Đã có lỗi xảy ra, vui lòng thử lại sau.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div>
      <div className="mb-8 text-center sm:text-left">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Đặt lại mật khẩu</h2>
        <p className="mt-2 text-gray-600">
          Tạo mật khẩu mới cho tài khoản của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        
        {/* Password Input */}
        <div className="space-y-1">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Mật khẩu mới
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              placeholder="Nhập mật khẩu mới..."
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

          {/* Password Strength UI */}
          {formData.password && !errors.password && (
            <div className="mt-2 flex items-center gap-2">
              <div className="flex-1 flex gap-1 h-1.5">
                <div className={`flex-1 rounded-full ${strength.score >= 1 ? strength.color : 'bg-gray-200'}`} />
                <div className={`flex-1 rounded-full ${strength.score >= 2 ? strength.color : 'bg-gray-200'}`} />
                <div className={`flex-1 rounded-full ${strength.score >= 3 ? strength.color : 'bg-gray-200'}`} />
              </div>
              <span className={`text-xs font-medium ${
                strength.score === 1 ? 'text-red-500' : 
                strength.score === 2 ? 'text-yellow-600' : 'text-emerald-600'
              }`}>
                {strength.label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu..."
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`pl-10 ${errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
            />
          </div>
          {errors.confirmPassword && (
            <p id="confirmPassword-error" className="text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium rounded-xl shadow-sm hover:shadow mt-4"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xử lý...
            </span>
          ) : (
            'Đặt lại mật khẩu'
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

export const ResetPasswordForm = () => {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <ResetPasswordFormContent />
    </Suspense>
  );
};
