import React from 'react';
import { PageContainer, Section } from '@/components/layout/core';
import { Button, Input } from '@/components/ui';

export const NewsletterSection = () => {
  return (
    <Section bgClass="bg-white">
      <PageContainer>
        <div className="rounded-3xl bg-[var(--color-primary)] px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:p-20 shadow-xl overflow-hidden relative">
          {/* Decor */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 opacity-20">
            <div className="h-64 w-64 rounded-full bg-white blur-3xl" />
          </div>

          <div className="lg:w-0 lg:flex-1 relative z-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Đăng ký nhận bản tin
            </h2>
            <p className="max-w-3xl mt-4 text-lg text-emerald-100">
              Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập nhật tin tức khuyến mãi mới nhất từ AgriMarket.
            </p>
          </div>
          
          <div className="mt-8 lg:mt-0 lg:ml-8 relative z-10 w-full max-w-md">
            <form className="sm:flex">
              <label htmlFor="email-address" className="sr-only">Địa chỉ Email</label>
              <div className="w-full">
                <Input 
                  id="email-address" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required 
                  placeholder="Nhập email của bạn..." 
                  className="w-full h-12 rounded-full border-none px-5 py-3 placeholder-gray-500 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[var(--color-primary)]"
                />
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                <Button type="submit" size="lg" className="w-full flex h-12 items-center justify-center rounded-full bg-gray-900 border-none text-white hover:bg-gray-800">
                  Đăng ký
                </Button>
              </div>
            </form>
            <p className="mt-3 text-sm text-emerald-100">
              Chúng tôi cam kết bảo mật thông tin của bạn. Xem <a href="#" className="text-white font-medium underline">Chính sách bảo mật</a>.
            </p>
          </div>
        </div>
      </PageContainer>
    </Section>
  );
};
