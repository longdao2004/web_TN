import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui';

export const AboutHero = () => {
  return (
    <section className="relative overflow-hidden bg-emerald-900 py-20 lg:py-32">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=2000&auto=format&fit=crop" 
          alt="AgriMarket Farm" 
          className="h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-emerald-900/40" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          AgriMarket <br className="hidden sm:block" />
          <span className="text-emerald-400">Kết nối nông sản sạch đến mọi gia đình</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
          Nền tảng thương mại điện tử giúp kết nối nông dân, cửa hàng nông sản và người tiêu dùng trên toàn quốc. Đảm bảo chất lượng, minh bạch và an toàn.
        </p>
        <Link href="/san-pham">
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-white border-none shadow-lg shadow-emerald-500/30 text-lg px-8 h-14 font-semibold group rounded-full">
            Khám phá sản phẩm
            <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
