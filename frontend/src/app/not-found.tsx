"use client";
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, ShoppingBag, ArrowLeft, Leaf } from 'lucide-react';
import { Button } from '@/components/ui';

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <title>404 - Không tìm thấy trang | AgriMarket</title>
      <div className="max-w-2xl w-full text-center space-y-8 animate-in fade-in zoom-in-95 duration-1000">
        
        {/* Floating Illustration */}
        <div className="relative w-48 h-48 mx-auto animate-[bounce_4s_ease-in-out_infinite]">
          <div className="absolute inset-0 bg-emerald-100 rounded-full blur-3xl opacity-50" />
          <div className="relative bg-white w-48 h-48 rounded-full shadow-2xl flex items-center justify-center border-4 border-emerald-50">
            <Leaf className="w-24 h-24 text-emerald-500" />
            <div className="absolute -bottom-2 -right-2 bg-red-100 w-16 h-16 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
              <span className="text-red-500 font-bold text-xl">404</span>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
            Không tìm thấy trang
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-lg">
            Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển sang một đường dẫn khác.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
          <Button 
            onClick={() => router.back()}
            variant="outline" 
            className="w-full sm:w-auto h-12 px-6 rounded-full text-gray-600 border-gray-300 hover:bg-gray-100"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Quay lại trang trước
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button 
              className="w-full h-12 px-6 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-0.5"
            >
              <Home className="w-5 h-5 mr-2" />
              Về trang chủ
            </Button>
          </Link>

          <Link href="/san-pham" className="w-full sm:w-auto">
            <Button 
              className="w-full h-12 px-6 rounded-full bg-gray-900 hover:bg-gray-800 text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Xem sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
