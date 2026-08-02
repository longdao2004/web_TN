import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Button, Avatar } from '@/components/ui';

export const CommentsPreview = () => {
  const mockComments = [
    {
      id: 1,
      author: 'Nguyễn Văn Nam',
      time: '2 giờ trước',
      content: 'Bài viết rất hữu ích, cảm ơn tác giả đã chia sẻ những kinh nghiệm quý báu này.',
      initials: 'N'
    },
    {
      id: 2,
      author: 'Trần Thị Thu',
      time: '5 giờ trước',
      content: 'Tôi đã áp dụng thử phương pháp này và thấy hiệu quả rõ rệt trên vườn rau nhà mình.',
      initials: 'T'
    },
    {
      id: 3,
      author: 'Lê Hoàng Minh',
      time: '1 ngày trước',
      content: 'Cho mình hỏi thêm về tỷ lệ pha trộn phân bón cụ thể được không ạ?',
      initials: 'L'
    }
  ];

  return (
    <div className="mt-12 bg-white rounded-2xl p-6 md:p-8 border border-gray-100 shadow-sm animate-in fade-in duration-1000">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          Bình luận (3)
        </h3>
      </div>

      <div className="space-y-6 mb-8">
        {mockComments.map((comment) => (
          <div key={comment.id} className="flex gap-4">
            <Avatar fallback={comment.initials} className="w-10 h-10 mt-1" />
            <div className="flex-1 bg-gray-50 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-gray-900 text-sm">{comment.author}</span>
                <span className="text-xs text-gray-500">{comment.time}</span>
              </div>
              <p className="text-gray-700 text-sm">{comment.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-gray-100">
        <Button variant="outline" className="w-full sm:w-auto font-semibold">
          Đăng nhập để bình luận
        </Button>
      </div>
    </div>
  );
};
