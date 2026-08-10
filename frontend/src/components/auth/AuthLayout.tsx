import React, { ReactNode } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AuthBanner } from './AuthBanner';
import { Header } from '../layout/PublicLayout/Header';
import { Footer } from '../layout/PublicLayout/Footer';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Header />
      
      <main className="flex-1 w-full py-10 lg:py-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl w-full">
          
          <div className="mb-6">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại trang chủ
            </Link>
          </div>

          <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-100 shadow-xl w-full">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] min-h-[600px]">
              
              {/* Mobile Banner */}
              <div className="block lg:hidden relative w-full h-[220px] sm:h-[260px]">
                <AuthBanner />
              </div>

              {/* Desktop Banner */}
              <div className="hidden lg:block relative w-full h-full">
                <AuthBanner />
              </div>

              {/* Right Column: Form */}
              <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-12 xl:p-14">
                {children}
              </div>

            </div>
          </div>
          
        </div>
      </main>

      <Footer />
    </div>
  );
};
