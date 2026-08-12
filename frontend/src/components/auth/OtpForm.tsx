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

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6);
  }, []);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (index: number, value: string) => {
    // Allow empty string (deletion)
    if (value === '') {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
      setError('');
      return;
    }

    // Extract only digits
    const digits = value.replace(/\D/g, '');
    if (!digits) return;

    // If multiple digits (e.g. from a paste that slipped through, or typing fast)
    // we take the last digit to replace the current one.
    const newValue = digits.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = newValue;
    setOtp(newOtp);
    setError('');

    // Auto focus next input
    if (newValue !== '' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        // If current is empty, focus previous
        inputRefs.current[index - 1]?.focus();
      } else {
        // If current has value, it will be handled by onChange (value becomes '')
        // But we can also clear it explicitly if needed, standard input handles it.
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pastedData) return;

    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) newOtp[i] = pastedData[i];
    }
    setOtp(newOtp);
    setError('');

    // Focus the last filled input or the next empty one
    const focusIndex = Math.min(pastedData.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const isOtpComplete = otp.every((digit) => digit !== '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOtpComplete) {
      setError('Vui lòng nhập đầy đủ mã OTP 6 số.');
      return;
    }

    const otpValue = otp.join('');
    
    if (otpValue === '000000') {
      setError('Mã OTP không chính xác hoặc đã hết hạn.');
      return;
    }

    setError('');
    setIsLoading(true);

    // Mock API call
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Xác thực thành công!', {
        description: 'Mời bạn đặt lại mật khẩu.'
      });
      router.push(`/dat-lai-mat-khau${email ? `?email=${encodeURIComponent(email)}` : ''}`);
    }, 1500);
  };

  const handleResend = () => {
    if (countdown > 0) return;
    
    setOtp(['', '', '', '', '', '']);
    setError('');
    setCountdown(60);
    inputRefs.current[0]?.focus();
    
    toast.success('Mã OTP mới đã được gửi.', {
      description: 'Vui lòng kiểm tra email của bạn.'
    });
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <Mail className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Xác thực OTP</h2>
        <p className="mt-2 text-gray-600">
          Mã xác thực đã được gửi tới email của bạn. <br className="hidden sm:block" />
          Vui lòng nhập mã gồm 6 chữ số để tiếp tục.
        </p>
        {email && (
          <p className="mt-4 text-sm font-medium text-gray-900">
            Mã đã được gửi tới: <span className="text-emerald-600">{email}</span>
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8" noValidate>
        <div>
          <div className="flex justify-center gap-2 sm:gap-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={2} // Allow 2 so typing a new digit over an old one registers in onChange
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                onFocus={(e) => e.target.select()} // Auto select content on focus
                className={`h-12 w-10 sm:h-14 sm:w-12 text-center text-2xl font-bold text-gray-900 rounded-xl border ${
                  error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : 'border-gray-300 focus:border-emerald-500 focus:ring-emerald-500/20'
                } bg-white shadow-sm focus:outline-none focus:ring-4 transition-all`}
                aria-label={`Digit ${index + 1}`}
              />
            ))}
          </div>
          {error && (
            <p className="text-sm text-red-500 mt-3 text-center">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full h-12 text-base font-medium rounded-xl shadow-sm hover:shadow"
          disabled={isLoading || !isOtpComplete}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Đang xác thực...
            </span>
          ) : (
            'Xác nhận OTP'
          )}
        </Button>
      </form>

      <div className="mt-8 text-center space-y-4">
        <p className="text-sm text-gray-600">
          Chưa nhận được mã?{' '}
          <button
            type="button"
            onClick={handleResend}
            disabled={countdown > 0}
            className={`font-medium transition-colors ${
              countdown > 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-emerald-600 hover:text-emerald-500 hover:underline'
            }`}
          >
            {countdown > 0 ? `Gửi lại mã sau ${countdown}s` : 'Gửi lại mã'}
          </button>
        </p>

        <div className="pt-2">
          <Link 
            href="/quen-mat-khau" 
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại quên mật khẩu
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
