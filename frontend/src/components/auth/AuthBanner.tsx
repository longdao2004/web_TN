import React from 'react';
import Image from 'next/image';

export const AuthBanner = () => {
  return (
    <div className="relative hidden h-full w-full flex-col justify-end bg-emerald-900 lg:flex">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banners/canhdong.avif"
          alt="Cánh đồng nông nghiệp xanh mướt"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-12 text-white">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <span className="text-2xl font-bold tracking-tight">AgriMarket</span>
        </div>

        <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight">
          Chào mừng đến với <br /> AgriMarket
        </h1>
        
        <p className="max-w-md text-lg text-emerald-100">
          Nền tảng thương mại điện tử nông sản kết nối người nông dân và người tiêu dùng, mang đến những sản phẩm sạch, an toàn và chất lượng.
        </p>
      </div>
    </div>
  );
};
