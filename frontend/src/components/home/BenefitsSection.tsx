import React from 'react';
import { PageContainer, Section } from '@/components/layout/core';
import { ShieldCheck, Leaf, Clock, HeadphonesIcon } from 'lucide-react';

export const BenefitsSection = () => {
  const benefits = [
    {
      name: 'Nông sản 100% Sạch',
      description: 'Sản phẩm được kiểm định nghiêm ngặt theo tiêu chuẩn VietGAP, GlobalGAP.',
      icon: <Leaf className="h-8 w-8 text-[var(--color-primary)]" />,
    },
    {
      name: 'Giao hàng Siêu Tốc',
      description: 'Giao hàng hỏa tốc trong 2h đối với khu vực nội thành, đảm bảo tươi ngon.',
      icon: <Clock className="h-8 w-8 text-[var(--color-primary)]" />,
    },
    {
      name: 'An tâm mua sắm',
      description: 'Bảo hành 1 đổi 1 hoặc hoàn tiền 100% nếu phát hiện hàng kém chất lượng.',
      icon: <ShieldCheck className="h-8 w-8 text-[var(--color-primary)]" />,
    },
    {
      name: 'Hỗ trợ 24/7',
      description: 'Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ bạn bất cứ lúc nào.',
      icon: <HeadphonesIcon className="h-8 w-8 text-[var(--color-primary)]" />,
    },
  ];

  return (
    <Section bgClass="bg-gray-50 border-y border-gray-100">
      <PageContainer>
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--color-primary-light)]">
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">{benefit.name}</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
