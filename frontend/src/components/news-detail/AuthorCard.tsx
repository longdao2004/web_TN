import React from 'react';
import { Avatar } from '@/components/ui';

interface AuthorCardProps {
  author: string;
}

export const AuthorCard = ({ author }: AuthorCardProps) => {
  return (
    <div className="bg-emerald-50 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 my-12 border border-emerald-100 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="shrink-0">
        <Avatar 
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop"
          fallback={author.charAt(0)}
          size="lg"
          className="w-20 h-20 ring-4 ring-white shadow-md"
        />
      </div>
      
      <div className="text-center md:text-left">
        <div className="text-sm text-emerald-600 font-bold uppercase tracking-wider mb-1">Tác giả bài viết</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">{author}</h3>
        <p className="text-gray-600 leading-relaxed">
          Chuyên gia phân tích thị trường nông nghiệp với hơn 10 năm kinh nghiệm. Luôn nỗ lực mang đến những thông tin chính xác và hữu ích nhất cho cộng đồng.
        </p>
      </div>
    </div>
  );
};
