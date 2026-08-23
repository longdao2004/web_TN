"use client";

import React, { useState } from 'react';
import { Star, MessageSquare, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui';
import { toast } from 'sonner';
import { reviewService } from '@/services/review.service';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  image: string;
}

interface ReviewSectionProps {
  status: string;
  products?: Product[];
}

export const ReviewSection = ({ status, products = [] }: ReviewSectionProps) => {
  // Chỉ hiển thị đánh giá khi đơn hàng đã giao (COMPLETED)
  if (status !== 'COMPLETED') return null;
  if (!products.length) return null;

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in delay-300 fill-mode-both">
      <div className="flex items-center gap-2 mb-5">
        <MessageSquare className="w-5 h-5 text-emerald-600" />
        <h2 className="text-lg font-bold text-gray-900">Đánh giá sản phẩm</h2>
      </div>
      
      <div className="space-y-6">
        {products.map((product) => (
          <ProductReviewForm key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

const ProductReviewForm = ({ product }: { product: Product }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await reviewService.createReview({
        productId: product.id,
        rating,
        comment: review
      });
      setIsSubmitted(true);
      toast.success(`Đánh giá ${product.name} thành công!`);
    } catch (error) {
      toast.error('Lỗi khi gửi đánh giá. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100 flex items-center gap-4">
        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-emerald-800">Đã đánh giá {product.name}</h3>
          <p className="text-xs text-emerald-600 mt-0.5">Bạn có thể xem lại trong Tài khoản {'>'} Đánh giá của tôi.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50/50">
      <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
        <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>
        <h3 className="font-medium text-sm text-gray-900">{product.name}</h3>
      </div>

      <div className="flex items-center gap-2 mb-1">
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
              className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-200 ${(hoverRating || rating) >= star ? 'fill-amber-400 text-amber-400' : 'fill-gray-100 text-gray-300'}`} 
            />
          </button>
        ))}
        <span className="ml-2 text-xs font-medium text-gray-500">
          {rating === 0 ? 'Chưa đánh giá' : 
           rating === 1 ? 'Tệ' : 
           rating === 2 ? 'Không hài lòng' : 
           rating === 3 ? 'Bình thường' : 
           rating === 4 ? 'Hài lòng' : 'Tuyệt vời'}
        </span>
      </div>
      
      <textarea
        className="w-full border border-gray-200 rounded-lg p-3 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 resize-none transition-all placeholder:text-gray-400"
        rows={2}
        placeholder="Chia sẻ nhận xét của bạn về sản phẩm này..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      ></textarea>
      
      <Button variant="primary" className="w-full sm:w-auto self-end font-medium text-sm py-2 px-6 shadow-md shadow-emerald-500/20" type="submit" disabled={isSubmitting}>
        {isSubmitting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
      </Button>
    </form>
  );
};
