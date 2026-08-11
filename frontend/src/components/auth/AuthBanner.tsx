import React from 'react';
import Image from 'next/image';

interface AuthBannerProps {
  type?: 'login' | 'register';
}

export const AuthBanner = ({ type = 'login' }: AuthBannerProps) => {
  const isLogin = type === 'login';

  return (
    <div className="relative h-full w-full flex flex-col justify-end bg-emerald-900">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/images/banners/canhdong.avif"
          alt="AgriMarket Banner"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 sm:p-8 lg:p-12 text-white">
        <div className="mb-4 lg:mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 lg:h-10 lg:w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <span className="text-xl lg:text-2xl font-bold text-white">A</span>
          </div>
          <span className="text-xl lg:text-2xl font-bold tracking-tight">AgriMarket</span>
        </div>

        <h1 className="mb-2 lg:mb-4 text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight">
          {isLogin ? (
            <>Chào mừng đến với <br className="hidden sm:block" /> AgriMarket</>
          ) : (
            <>Tham gia cùng <br className="hidden sm:block" /> AgriMarket</>
          )}
        </h1>
        
        <p className="max-w-md text-sm sm:text-base lg:text-lg text-emerald-100 line-clamp-2 sm:line-clamp-none">
          {isLogin 
            ? "Nền tảng thương mại điện tử nông sản kết nối người nông dân và người tiêu dùng, mang đến những sản phẩm sạch, an toàn và chất lượng."
            : "Đăng ký tài khoản để mua sắm nông sản sạch, chất lượng và kết nối với những nhà cung cấp uy tín."
          }
        </p>
      </div>
    </div>
  );
};
