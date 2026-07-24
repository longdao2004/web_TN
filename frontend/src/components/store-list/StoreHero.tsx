"use client";
import React from "react";
import { Button } from "@/components/ui";
import { Store } from "lucide-react";

export const StoreHero = () => {
  return (
    <div className="relative overflow-hidden bg-emerald-900 rounded-3xl animate-in fade-in duration-1000 mb-8 sm:mb-12">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
          alt="Nông sản sạch"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-900 via-emerald-900/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative px-6 py-16 sm:px-12 sm:py-24 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/50 border border-emerald-700 text-emerald-100 text-sm font-medium mb-6">
          <Store className="w-4 h-4" />
          <span>Hơn 500+ nhà vườn uy tín</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight tracking-tight">
          Khám phá hệ thống <br />
          <span className="text-emerald-400">cửa hàng nông sản</span>
        </h1>

        <p className="text-emerald-50 text-base sm:text-lg mb-8 max-w-lg leading-relaxed opacity-90">
          Mua sắm trực tiếp từ các hợp tác xã, nhà vườn và hệ thống phân phối
          đạt chuẩn VietGAP, GlobalGAP, OCOP trên toàn quốc.
        </p>

        <Button
          variant="primary"
          size="lg"
          className="rounded-full px-8 h-12 sm:h-14 font-bold text-emerald-900 bg-emerald-400 hover:bg-emerald-300 border-none shadow-lg shadow-emerald-900/20"
          onClick={() => {
            document
              .getElementById("store-list-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Khám phá ngay
        </Button>
      </div>
    </div>
  );
};
