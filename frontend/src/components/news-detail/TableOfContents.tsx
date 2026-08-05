"use client";
import React, { useEffect, useState } from "react";
import { AlignLeft } from "lucide-react";

export const TableOfContents = () => {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);

  useEffect(() => {
    // Tìm tất cả các thẻ h2 trong nội dung bài viết
    const elements = document.querySelectorAll("article h2");
    const items = Array.from(elements).map((el, index) => {
      // Gắn ID nếu thẻ chưa có ID
      if (!el.id) {
        el.id = `heading-${index}`;
      }
      return {
        id: el.id,
        text: el.textContent || "",
      };
    });
    const timer = setTimeout(() => setHeadings(items), 0);
    return () => clearTimeout(timer);
  }, []);

  const scrollToHeading = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      // Cuộn đến vị trí có offset cho header
      const y = element.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  if (headings.length === 0) return null;

  return (
    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 sticky top-24">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlignLeft className="w-5 h-5 text-emerald-600" />
        Mục lục
      </h3>
      <ul className="space-y-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => scrollToHeading(e, heading.id)}
              className="text-gray-600 hover:text-emerald-600 text-sm font-medium transition-colors line-clamp-2"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};
