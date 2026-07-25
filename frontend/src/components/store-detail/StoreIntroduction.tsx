import React from 'react';
import { Info } from 'lucide-react';

interface StoreIntroductionProps {
  introduction: string;
}

export const StoreIntroduction = ({ introduction }: StoreIntroductionProps) => {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm h-full animate-in slide-in-from-bottom-6 duration-700 fade-in delay-200">
      <h2 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
        <Info className="w-5 h-5 text-emerald-600" />
        Giới thiệu cửa hàng
      </h2>
      
      <div 
        className="prose prose-sm sm:prose-base prose-emerald max-w-none text-gray-600 leading-relaxed
        prose-headings:font-bold prose-headings:text-gray-900 prose-headings:mb-3 prose-headings:mt-6
        prose-p:mb-4
        prose-ul:list-disc prose-ul:pl-5 prose-li:mb-2 prose-li:marker:text-emerald-500"
        dangerouslySetInnerHTML={{ __html: introduction }}
      />
    </div>
  );
};
