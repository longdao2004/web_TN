import React from "react";
import Image from "next/image";

export const ContactHero = () => {
  return (
    <section className="relative overflow-hidden bg-emerald-900 py-16 sm:py-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1596731998522-8eb129d2b23a?q=80&w=2000&auto=format&fit=crop"
          alt="AgriMarket Support"
          className="h-full w-full object-cover opacity-20"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-900/60 to-emerald-900" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
          Liên hệ với <span className="text-emerald-400">AgriMarket</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-emerald-100 leading-relaxed">
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy gửi câu hỏi hoặc góp ý để
          chúng tôi phục vụ bạn tốt hơn.
        </p>
      </div>
    </section>
  );
};
