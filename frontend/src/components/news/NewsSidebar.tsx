import React from "react";
import Link from "next/link";
import { mockNews, newsCategories, popularTags } from "@/mock/news";
import Image from "next/image";

export const NewsSidebar = () => {
  // Lấy 3 bài viết mới nhất
  const recentNews = mockNews.slice(0, 3);

  return (
    <aside className="space-y-10 animate-in fade-in slide-in-from-right-8 duration-1000">
      {/* Recent Posts */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          Bài viết mới nhất
        </h3>
        <div className="space-y-6">
          {recentNews.map((news) => (
            <Link
              key={news.id}
              href={`/tin-tuc/${news.slug}`}
              className="flex gap-4 group"
            >
              <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden">
                <Image
                  src={news.image}
                  alt={news.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  width={500}
                  height={500}
                />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 group-hover:text-emerald-600 transition-colors mb-1">
                  {news.title}
                </h4>
                <p className="text-xs text-gray-500">{news.publishedAt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          Danh mục
        </h3>
        <ul className="space-y-3">
          {newsCategories
            .filter((c) => c !== "Tất cả")
            .map((cat) => (
              <li key={cat}>
                <Link
                  href="#"
                  className="flex items-center justify-between text-gray-600 hover:text-emerald-600 group transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-emerald-500 transition-colors" />
                    {cat}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                    {idx + 5}
                  </span>
                </Link>
              </li>
            ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
          <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
          Tags phổ biến
        </h3>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <Link
              key={tag}
              href="#"
              className="px-3 py-1.5 bg-gray-100 hover:bg-emerald-600 text-gray-600 hover:text-white text-xs font-medium rounded-lg transition-colors"
            >
              #{tag}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
};
