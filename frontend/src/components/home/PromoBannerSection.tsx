import React from 'react';
import { PageContainer, Section } from '@/components/layout/core';
import { Button } from '@/components/ui';

export const PromoBannerSection = () => {
  return (
    <Section className="py-0">
      <PageContainer fluid className="px-0 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-emerald-900 text-white shadow-xl">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1500&auto=format&fit=crop" 
              alt="Promo background" 
              className="h-full w-full object-cover opacity-20"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent" />
          </div>
          
          <div className="relative flex flex-col justify-center px-6 py-16 sm:px-12 sm:py-24 lg:w-2/3 lg:px-20">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Siêu Sale Giữa Tháng <br /> 
              <span className="text-emerald-400">Giảm đến 50%</span>
            </h2>
            <p className="mt-6 max-w-xl text-lg text-emerald-100">
              Cơ hội vàng để tích trữ thực phẩm sạch cho gia đình. Miễn phí vận chuyển cho mọi đơn hàng từ 500k.
            </p>
            <div className="mt-8 flex gap-4">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 border-none text-white font-semibold shadow-lg">
                Săn ưu đãi ngay
              </Button>
            </div>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};
