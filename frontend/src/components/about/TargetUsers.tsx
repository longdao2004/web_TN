import React from 'react';
import { PageContainer } from '@/components/layout/core';
import { ShoppingBag, Store, Shield } from 'lucide-react';

const users = [
  {
    role: 'Người mua',
    title: 'Khách hàng',
    description: 'Dễ dàng tìm kiếm và mua sắm các loại nông sản tươi ngon, an toàn với nguồn gốc rõ ràng.',
    icon: <ShoppingBag className="w-10 h-10 text-emerald-500" />,
    features: ['Đa dạng sản phẩm', 'Mua sắm dễ dàng', 'Thanh toán an toàn'],
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800&auto=format&fit=crop'
  },
  {
    role: 'Người bán',
    title: 'Nhà cung cấp',
    description: 'Nền tảng số giúp tiếp cận hàng ngàn khách hàng tiềm năng, gia tăng doanh thu và xây dựng thương hiệu.',
    icon: <Store className="w-10 h-10 text-blue-500" />,
    features: ['Quản lý gian hàng', 'Thống kê doanh thu', 'Hỗ trợ vận chuyển'],
    image: 'https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=800&auto=format&fit=crop'
  },
  {
    role: 'Quản trị viên',
    title: 'Đội ngũ AgriMarket',
    description: 'Những người hùng thầm lặng kiểm duyệt chất lượng, hỗ trợ đối tác và đảm bảo hệ thống vận hành trơn tru.',
    icon: <Shield className="w-10 h-10 text-amber-500" />,
    features: ['Kiểm duyệt chặt chẽ', 'Hỗ trợ 24/7', 'Bảo vệ quyền lợi'],
    image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32b7?q=80&w=800&auto=format&fit=crop'
  }
];

export const TargetUsers = () => {
  return (
    <section className="py-20 bg-gray-50">
      <PageContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Đối tượng phục vụ</h2>
          <p className="text-lg text-gray-600">Chúng tôi xây dựng nền tảng để kết nối và mang lại giá trị cho tất cả các bên tham gia.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {users.map((user, idx) => (
            <div key={idx} className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-8 group" style={{ animationDelay: `${idx * 150}ms` }}>
              <div className="h-48 overflow-hidden relative">
                <img src={user.image} alt={user.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-6 text-white text-sm font-semibold uppercase tracking-wider">{user.role}</div>
              </div>
              
              <div className="p-8">
                <div className="mb-4">{user.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{user.title}</h3>
                <p className="text-gray-600 mb-6 line-clamp-3">{user.description}</p>
                
                <ul className="space-y-2">
                  {user.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  );
};
