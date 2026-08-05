"use client";
import React from "react";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui";
import Image from "next/image";

export const NewsHero = () => {
  const scrollToArticles = () => {
    const el = document.getElementById("news-content");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative overflow-hidden bg-emerald-900 py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1595858603370-d5a230721245?q=80&w=2000&auto=format&fit=crop"
          alt="AgriMarket News"
          className="h-full w-full object-cover opacity-20"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-900 to-emerald-900/60" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          Tin tức & <span className="text-emerald-400">Kiến thức nông sản</span>
        </h1>
        <p className="text-lg sm:text-xl text-emerald-100 mb-10 leading-relaxed">
          Cập nhật tin tức mới nhất về nông nghiệp, nông sản, xu hướng thị
          trường và các mẹo hữu ích dành cho cả người tiêu dùng và nhà nông.
        </p>
        <Button
          size="lg"
          onClick={scrollToArticles}
          className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-full px-8 h-14 text-lg font-medium shadow-lg group"
        >
          Khám phá bài viết
          <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform" />
        </Button>
      </div>
    </section>
  );
};
