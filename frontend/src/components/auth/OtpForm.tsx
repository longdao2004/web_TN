'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { Button } from '../ui/Button';
import { toast } from 'sonner';

const OtpFormContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Mail className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Kiểm tra email của bạn</h2>
        <p className="mt-2 text-gray-600">
          Chúng tôi đã gửi một liên kết khôi phục mật khẩu. <br className="hidden sm:block" />
          Vui lòng kiểm tra hộp thư đến (hoặc thư mục rác) để tiếp tục.
        </p>
        {email && (
          <p className="mt-4 text-sm font-medium text-gray-900">
            Email đã gửi tới: <span className="text-emerald-600">{email}</span>
          </p>
        )}
      </div>

      <div className="mt-8 text-center space-y-4">
        <div className="pt-2">
          <Link 
            href="/dang-nhap" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export const OtpForm = () => {
  return (
    <Suspense fallback={
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    }>
      <OtpFormContent />
    </Suspense>
  );
};
