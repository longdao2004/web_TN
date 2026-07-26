import React from 'react';
import { PageContainer } from '@/components/layout/core';
import { Store, ShoppingBag, Users, Package } from 'lucide-react';

const stats = [
  { label: 'Cửa hàng', value: '150+', icon: <Store className="w-8 h-8 opacity-80" /> },
  { label: 'Sản phẩm', value: '500+', icon: <Package className="w-8 h-8 opacity-80" /> },
  { label: 'Khách hàng', value: '5.000+', icon: <Users className="w-8 h-8 opacity-80" /> },
  { label: 'Đơn hàng', value: '10.000+', icon: <ShoppingBag className="w-8 h-8 opacity-80" /> },
];

export const Statistics = () => {
  return (
    <section className="py-20 bg-emerald-600">
      <PageContainer>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center text-white text-center animate-in zoom-in duration-700" style={{ animationDelay: `${idx * 100}ms` }}>
              <div className="mb-4 text-emerald-200">
                {stat.icon}
              </div>
              <div className="text-4xl sm:text-5xl font-bold mb-2 tracking-tight">
                {stat.value}
              </div>
              <div className="text-emerald-100 font-medium uppercase tracking-wider text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
