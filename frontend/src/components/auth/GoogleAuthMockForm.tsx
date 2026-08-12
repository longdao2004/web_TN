'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

export const GoogleAuthMockForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = () => {
    setIsLoading(true);

    // Mock processing time
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Đăng nhập Google thành công!', {
        description: 'Chào mừng bạn quay lại AgriMarket.'
      });
      router.push('/');
    }, 1500);
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50 border border-gray-200 shadow-sm">
          <svg className="w-8 h-8" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Đăng nhập với Google</h2>
        <p className="mt-2 text-gray-600">
          Tiếp tục đăng nhập vào AgriMarket bằng tài khoản Google của bạn.
        </p>
      </div>

      <div className="bg-gray-50 p-4 sm:p-6 rounded-2xl border border-gray-200 flex items-center gap-4 mb-8">
        <div className="relative h-12 w-12 sm:h-14 sm:w-14 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-700 font-bold text-xl">
          N
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-base sm:text-lg truncate">Nguyễn Văn A</p>
          <p className="text-sm text-gray-500 truncate">example@gmail.com</p>
        </div>
      </div>

      <div className="space-y-3 sm:space-y-4">
        <Button
          onClick={handleContinue}
          disabled={isLoading}
          className="w-full h-12 text-base font-medium rounded-xl shadow-sm hover:shadow"
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xác thực...
            </span>
          ) : (
            'Tiếp tục với Google'
          )}
        </Button>
        
        <Link href="/dang-nhap" className="block w-full">
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            className="w-full h-12 text-base font-medium rounded-xl text-gray-700 bg-white border-gray-300 hover:bg-gray-50"
          >
            Hủy
          </Button>
        </Link>
      </div>
    </div>
  );
};
