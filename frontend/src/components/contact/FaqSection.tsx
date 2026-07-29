"use client";
import React from "react";
import { Accordion } from "@/components/ui";
import { contactFaqs } from "@/mock/contact";

export const FaqSection = () => {
  return (
    <div className="animate-in slide-in-from-left-8 fade-in duration-1000 h-full flex flex-col justify-center">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
        Câu hỏi thường gặp
      </h2>
      <p className="text-gray-600 mb-8">
        Tổng hợp những câu hỏi phổ biến từ khách hàng và đối tác của AgriMarket.
        Nếu bạn chưa tìm thấy câu trả lời, đừng ngần ngại gửi tin nhắn cho chúng
        tôi.
      </p>

      <Accordion
        items={contactFaqs.map((faq) => ({
          id: faq.id,
          title: faq.question,
          content: faq.answer,
        }))}
      />
    </div>
  );
};
