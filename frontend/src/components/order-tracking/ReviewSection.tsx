import React, { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui';
import { toast } from 'sonner';

interface ReviewSectionProps {
  status: string;
}

export const ReviewSection = ({ status }: ReviewSectionProps) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Chỉ hiển thị đánh giá khi đơn hàng đã giao
  if (status !== 'Đã giao') return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    setIsSubmitted(true);
    toast.success('Gửi đánh giá thành công!', {
      description: 'Cảm ơn bạn đã chia sẻ trải nghiệm.'
    });
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 text-center animate-in zoom-in-95 duration-500 fade-in">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <Star className="w-6 h-6 fill-emerald-600" />
        </div>
        <h3 className="text-lg font-bold text-emerald-800">Cảm ơn bạn đã đánh giá!</h3>
        <p className="text-sm text-emerald-600 mt-1">Đánh giá của bạn giúp cộng đồng AgriMarket mua sắm thông minh hơn.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300 fill-mode-both">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Đánh giá sản phẩm</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex items-center gap-2 mx-auto mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="focus:outline-none transition-transform hover:scale-110 active:scale-95"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => setRating(star)}
            >
              <Star 
                className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors duration-200 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-300'}`} 
              />
            </button>
          ))}
        </div>
        <div className="text-center text-sm font-medium text-gray-500 mb-2">
          {rating === 0 ? 'Vui lòng chọn sao' : 
           rating === 1 ? 'Tệ' : 
           rating === 2 ? 'Không hài lòng' : 
           rating === 3 ? 'Bình thường' : 
           rating === 4 ? 'Hài lòng' : 'Tuyệt vời'}
        </div>
        
        <textarea
          className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder:text-gray-400"
          rows={3}
          placeholder="Hãy chia sẻ nhận xét của bạn về sản phẩm nhé..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        ></textarea>
        
        <Button variant="primary" className="w-full font-bold shadow-md shadow-emerald-500/20" type="submit">
          Gửi đánh giá
        </Button>
      </form>
    </div>
  );
};
