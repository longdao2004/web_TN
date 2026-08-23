"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Star, Edit2, Trash2, Loader2, MessageSquare } from "lucide-react";
import { reviewService, Review } from "@/services/review.service";
import { toast } from "sonner";
import { Button } from "@/components/ui";

export default function MyReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for Editing
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const data = await reviewService.getMyReviews();
      setReviews(data);
    } catch (error) {
      toast.error("Không thể tải danh sách đánh giá.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (review: Review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
  };

  const cancelEdit = () => {
    setEditingReview(null);
    setEditRating(0);
    setEditComment("");
  };

  const submitEdit = async () => {
    if (!editingReview) return;
    if (editRating === 0) {
      toast.error("Vui lòng chọn số sao");
      return;
    }

    setIsSubmitting(true);
    try {
      await reviewService.updateReview(editingReview.id, {
        rating: editRating,
        comment: editComment
      });
      toast.success("Cập nhật đánh giá thành công");
      setEditingReview(null);
      fetchReviews(); // Tải lại danh sách
    } catch (error) {
      toast.error("Lỗi khi cập nhật đánh giá");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đánh giá này không?")) return;
    
    try {
      await reviewService.deleteReview(id);
      toast.success("Xóa đánh giá thành công");
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      toast.error("Lỗi khi xóa đánh giá");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-primary)]" />
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-8 text-center">
        <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đánh giá nào</h2>
        <p className="text-gray-500 mb-6">Bạn chưa viết bất kỳ đánh giá nào cho các sản phẩm đã mua.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Đánh giá của tôi</h1>

      {/* Danh sách Đánh giá */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl shadow-sm border border-[var(--color-border)] p-4 sm:p-6 transition-all hover:shadow-md">
            
            {/* Nếu ĐANG EDIT bài này thì hiện Form, ngược lại hiện View */}
            {editingReview?.id === review.id ? (
              <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100">
                    <Image src={review.product.imageUrl} alt={review.product.name} fill className="object-cover" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{review.product.name}</h3>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Số sao</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setEditRating(star)}
                        className="focus:outline-none hover:scale-110 transition-transform"
                      >
                        <Star className={`w-8 h-8 ${editRating >= star ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-300"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung đánh giá</label>
                  <textarea
                    rows={3}
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm text-gray-900 bg-white focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] outline-none placeholder:text-gray-400"
                    placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button onClick={submitEdit} disabled={isSubmitting} className="min-w-[100px]">
                    {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Lưu"}
                  </Button>
                  <Button variant="outline" onClick={cancelEdit} disabled={isSubmitting}>
                    Hủy
                  </Button>
                </div>
              </div>
            ) : (
              // Trạng thái VIEW
              <>
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-md overflow-hidden bg-gray-100 shrink-0">
                      <Image src={review.product.imageUrl} alt={review.product.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{review.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {new Intl.DateTimeFormat("vi-VN", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(new Date(review.createdAt))}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => handleEditClick(review)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Sửa đánh giá"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(review.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Xóa đánh giá"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${review.rating >= star ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-300"}`}
                    />
                  ))}
                </div>
                
                {review.comment && (
                  <p className="text-gray-700 text-sm bg-gray-50 p-3 rounded-lg border border-gray-100">
                    {review.comment}
                  </p>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
