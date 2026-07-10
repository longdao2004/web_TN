import React from 'react';
import { PageContainer, Section } from '@/components/layout/core';
import { Search, ShoppingCart, CreditCard, Truck } from 'lucide-react';

export const BuyingProcessSection = () => {
  const steps = [
    {
      id: 1,
      name: 'Khám phá',
      description: 'Tìm kiếm sản phẩm hoặc cửa hàng yêu thích.',
      icon: <Search className="h-6 w-6" />,
    },
    {
      id: 2,
      name: 'Chọn mua',
      description: 'Thêm sản phẩm vào giỏ hàng.',
      icon: <ShoppingCart className="h-6 w-6" />,
    },
    {
      id: 3,
      name: 'Thanh toán',
      description: 'Thanh toán an toàn qua nhiều hình thức.',
      icon: <CreditCard className="h-6 w-6" />,
    },
    {
      id: 4,
      name: 'Nhận hàng',
      description: 'Giao hàng tận nơi nhanh chóng trong 2h.',
      icon: <Truck className="h-6 w-6" />,
    },
  ];

  return (
    <Section bgClass="bg-white">
      <PageContainer>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Mua sắm dễ dàng</h2>
          <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
            Chỉ với 4 bước đơn giản, thực phẩm tươi sạch đã có mặt tại nhà bạn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-[10%] right-[10%] h-0.5 bg-gray-100 -translate-y-full" />
          
          {steps.map((step) => (
            <div key={step.id} className="relative flex flex-col items-center text-center group">
              <div className="z-10 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-lg border-2 border-gray-50 text-[var(--color-primary)] transition-transform duration-300 group-hover:-translate-y-2 group-hover:border-[var(--color-primary-light)]">
                {step.icon}
              </div>
              <h3 className="mt-6 text-lg font-bold text-gray-900">{step.name}</h3>
              <p className="mt-2 text-sm text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
