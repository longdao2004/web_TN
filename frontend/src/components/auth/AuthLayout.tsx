import React, { ReactNode } from 'react';
import Link from 'next/link';
import { AuthBanner } from './AuthBanner';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen w-full bg-white lg:bg-gray-50">
      {/* Banner Left Side - Desktop Only */}
      <div className="hidden lg:block lg:w-1/2 xl:w-5/12">
        <div className="sticky top-0 h-screen w-full">
          <AuthBanner />
        </div>
      </div>

      {/* Form Right Side */}
      <div className="flex w-full flex-col px-4 sm:px-6 lg:w-1/2 xl:w-7/12">
        <div className="flex min-h-screen flex-col justify-center py-12 lg:px-8 xl:px-24">
          
          {/* Mobile Logo Header */}
          <div className="mb-10 flex items-center justify-center gap-2 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600">
                <span className="text-2xl font-bold text-white">A</span>
              </div>
              <span className="text-2xl font-bold tracking-tight text-gray-900">AgriMarket</span>
            </Link>
          </div>

          <div className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-xl">
            <div className="rounded-3xl bg-white lg:p-10 lg:shadow-xl lg:shadow-emerald-900/5 lg:ring-1 lg:ring-gray-100">
              {children}
            </div>
          </div>

          {/* Mobile Footer Spacing (to match visual weight) */}
          <div className="h-12 lg:hidden" />
        </div>
      </div>
    </div>
  );
};
