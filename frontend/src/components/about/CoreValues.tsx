import React from 'react';
import { PageContainer } from '@/components/layout/core';
import { Leaf, ShieldCheck, CreditCard, Truck } from 'lucide-react';

const values = [
  {
    id: 1,
    title: 'Nông sản chất lượng',
    description: 'Chỉ cung cấp các sản phẩm đạt tiêu chuẩn an toàn, tươi ngon, được chọn lọc kỹ lưỡng từ các nông trại uy tín.',
    icon: <Leaf className="h-8 w-8 text-emerald-500" />,
    bgColor: 'bg-emerald-50',
  },
  {
    id: 2,
    title: 'Minh bạch nguồn gốc',
    description: 'Mọi thông tin về xuất xứ, quy trình trồng trọt và chứng nhận đều được công khai rõ ràng trên hệ thống.',
    icon: <ShieldCheck className="h-8 w-8 text-blue-500" />,
    bgColor: 'bg-blue-50',
  },
  {
    id: 3,
    title: 'Thanh toán an toàn',
    description: 'Hệ thống thanh toán bảo mật với nhiều phương thức đa dạng, đảm bảo quyền lợi tuyệt đối cho khách hàng.',
    icon: <CreditCard className="h-8 w-8 text-amber-500" />,
    bgColor: 'bg-amber-50',
  },
  {
    id: 4,
    title: 'Giao hàng nhanh',
    description: 'Quy trình đóng gói tiêu chuẩn và đối tác vận chuyển chuyên nghiệp, đảm bảo độ tươi ngon khi đến tay bạn.',
    icon: <Truck className="h-8 w-8 text-purple-500" />,
    bgColor: 'bg-purple-50',
  }
];

export const CoreValues = () => {
  return (
    <section className="py-20 bg-gray-50">
      <PageContainer>
        <div className="text-center max-w-3xl mx-auto mb-16 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Giá trị cốt lõi</h2>
          <p className="text-lg text-gray-600">Những tiêu chuẩn khắt khe mà chúng tôi luôn tuân thủ để mang lại trải nghiệm mua sắm tốt nhất.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, idx) => (
            <div 
              key={value.id} 
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${value.bgColor}`}>
                {value.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
              <p className="text-gray-600 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
