import React from 'react';
import { PageContainer } from '@/components/layout/core';
import { CheckCircle2 } from 'lucide-react';

const commitments = [
  'Minh bạch thông tin sản phẩm và quy trình sản xuất.',
  'Hỗ trợ công nghệ và kỹ năng bán hàng cho nhà nông.',
  'Bảo vệ tối đa quyền lợi của người mua hàng.',
  'Bảo mật thông tin cá nhân và dữ liệu thanh toán.',
  'Không ngừng cải tiến trải nghiệm người dùng.',
  'Đóng góp vào sự phát triển của nông nghiệp xanh.'
];

export const Commitments = () => {
  return (
    <section className="py-20 bg-white">
      <PageContainer>
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-1/2 animate-in fade-in slide-in-from-left-8 duration-1000">
            <img 
              src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000&auto=format&fit=crop" 
              alt="Cam kết AgriMarket" 
              className="rounded-3xl shadow-xl w-full h-[400px] object-cover"
            />
          </div>
          
          <div className="md:w-1/2 animate-in fade-in slide-in-from-right-8 duration-1000">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Cam kết của AgriMarket</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Sự thành công của AgriMarket không đo bằng doanh thu, mà được đo bằng niềm tin của đối tác và sự hài lòng của khách hàng.
            </p>
            
            <div className="space-y-4">
              {commitments.map((text, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
                  <span className="text-gray-700 text-lg">{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
};
