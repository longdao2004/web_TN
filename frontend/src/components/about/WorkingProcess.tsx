import React from 'react';
import { PageContainer } from '@/components/layout/core';
import { Upload, CheckCircle, Store, ShoppingCart, Truck } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Người bán đăng sản phẩm',
    description: 'Nông dân/Cửa hàng tạo gian hàng và đăng tải sản phẩm kèm thông tin chi tiết.',
    icon: <Upload className="w-6 h-6 text-white" />,
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Quản trị viên kiểm duyệt',
    description: 'Đội ngũ kiểm tra thông tin, giấy chứng nhận để đảm bảo tiêu chuẩn chất lượng.',
    icon: <CheckCircle className="w-6 h-6 text-white" />,
    color: 'bg-amber-500',
  },
  {
    id: 3,
    title: 'Sản phẩm được hiển thị',
    description: 'Sản phẩm chính thức lên sàn, tiếp cận hàng ngàn khách hàng tiềm năng.',
    icon: <Store className="w-6 h-6 text-white" />,
    color: 'bg-emerald-500',
  },
  {
    id: 4,
    title: 'Người mua đặt hàng',
    description: 'Khách hàng chọn sản phẩm, thêm vào giỏ và thanh toán dễ dàng.',
    icon: <ShoppingCart className="w-6 h-6 text-white" />,
    color: 'bg-purple-500',
  },
  {
    id: 5,
    title: 'Giao hàng thành công',
    description: 'Người bán đóng gói, đơn vị vận chuyển giao tận tay khách hàng an toàn.',
    icon: <Truck className="w-6 h-6 text-white" />,
    color: 'bg-rose-500',
  }
];

export const WorkingProcess = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <PageContainer>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quy trình hoạt động</h2>
          <p className="text-lg text-gray-600">Cách AgriMarket vận hành để đảm bảo chất lượng từ nông trại đến bàn ăn.</p>
        </div>

        <div className="relative">
          {/* Timeline Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>

          <div className="flex flex-col lg:flex-row gap-8 lg:gap-4 relative z-10">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex-1 flex lg:flex-col items-center gap-6 lg:gap-4 text-left lg:text-center animate-in fade-in slide-in-from-bottom-8" style={{ animationDelay: `${idx * 150}ms` }}>
                
                {/* Mobile Line connector */}
                {idx !== steps.length - 1 && (
                  <div className="lg:hidden absolute left-[31px] top-[60px] bottom-[-40px] w-0.5 bg-gray-100 z-0"></div>
                )}

                <div className={`w-16 h-16 rounded-full flex shrink-0 items-center justify-center ${step.color} shadow-lg shadow-${step.color}/20 z-10`}>
                  {step.icon}
                </div>
                
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.id}. {step.title}</h3>
                  <p className="text-sm text-gray-500">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
