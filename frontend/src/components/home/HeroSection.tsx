import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { PageContainer } from '@/components/layout/core';
import { ArrowRight, ShoppingCart } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-gray-50 pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3 opacity-20 hidden md:block">
        <div className="h-96 w-96 rounded-full bg-[var(--color-primary)] blur-3xl" />
      </div>
      
      <PageContainer>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          
          {/* Content Left */}
          <div className="flex flex-col items-start space-y-6 z-10">
            <div className="inline-flex items-center rounded-full bg-[var(--color-primary-light)] px-3 py-1 text-sm font-medium text-[var(--color-primary-hover)]">
              🌿 Trực tiếp từ nông trại đến bàn ăn
            </div>
            
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl lg:text-5xl xl:text-6xl">
              Nông sản <span className="text-[var(--color-primary)]">Tươi Sạch</span> <br className="hidden sm:block" /> 
              An Toàn Cho Sức Khỏe
            </h1>
            
            <p className="max-w-lg text-lg text-gray-600">
              Kết nối trực tiếp người nông dân với người tiêu dùng. Cung cấp các loại rau củ quả, thịt cá tươi sống chuẩn VietGAP mỗi ngày.
            </p>
            
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/san-pham">
                <Button size="lg" className="h-14 px-8 text-base">
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Mua sắm ngay
                </Button>
              </Link>
              <Link href="/san-pham">
                <Button size="lg" variant="outline" className="h-14 px-8 text-base bg-white">
                  Khám phá thêm
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-6 pt-6 text-sm font-medium text-gray-500">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </div>
                Giao nhanh 2h
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  ✓
                </div>
                Tươi 100%
              </div>
            </div>
          </div>

          {/* Image Right */}
          <div className="relative z-10 h-[400px] w-full sm:h-[500px] lg:h-[600px]">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1000&auto=format&fit=crop" 
              alt="Fresh Vegetables" 
              className="absolute inset-0 h-full w-full rounded-2xl object-cover shadow-2xl"
            />
            
            {/* Floating Card */}
            <div className="absolute -bottom-6 -left-6 hidden rounded-xl bg-white p-4 shadow-xl sm:flex items-center gap-4 animate-bounce">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
                ⭐
              </div>
              <div>
                <p className="font-bold text-gray-900">4.9/5</p>
                <p className="text-xs text-gray-500">Từ 10.000+ khách hàng</p>
              </div>
            </div>
          </div>
          
        </div>
      </PageContainer>
    </section>
  );
};
