import React from "react";
import { Calendar, Clock, Eye, User } from "lucide-react";
import { NewsArticle } from "@/mock/news";
import Image from "next/image";

interface ArticleHeroProps {
  article: NewsArticle;
}

export const ArticleHero = ({ article }: ArticleHeroProps) => {
  return (
    <section className="relative pt-32 pb-16 bg-gray-900 overflow-hidden text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover opacity-30"
          width={500}
          height={500}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="inline-block bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider py-1.5 px-4 rounded-full mb-6 shadow-sm">
          {article.category}
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6 leading-tight">
          {article.title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
          {article.description}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-400 font-medium">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            {article.author}
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" />
            {article.publishedAt}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            {article.readTime}
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            {article.viewCount?.toLocaleString("vi-VN")} lượt xem
          </div>
        </div>
      </div>
    </section>
  );
};
