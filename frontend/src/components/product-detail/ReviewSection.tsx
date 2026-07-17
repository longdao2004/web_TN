import React from "react";
import { Star, ThumbsUp } from "lucide-react";
import { Review } from "@/types/product-detail";
import { Avatar } from "@/components/ui";

interface ReviewSectionProps {
  reviews: Review[];
  rating: number;
  reviewCount: number;
}

export const ReviewSection = ({
  reviews,
  rating,
  reviewCount,
}: ReviewSectionProps) => {
  return (
    <div className="py-2">
      {/* Summary */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 mb-8 p-6 rounded-2xl bg-amber-50/50 border border-amber-100">
        <div className="flex flex-col items-center text-center shrink-0">
          <div className="text-5xl font-black text-amber-500 mb-2">
            {rating}
          </div>
          <div className="flex items-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                className={`h-5 w-5 ${s <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500">{reviewCount} đánh giá</div>
        </div>

        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((s) => {
            // Mock percentage
            const pct =
              s === 5 ? 75 : s === 4 ? 15 : s === 3 ? 5 : s === 2 ? 3 : 2;
            return (
              <div key={s} className="flex items-center gap-3 text-sm">
                <div className="flex items-center gap-1 w-10 shrink-0 text-gray-600 font-medium">
                  {s} <Star className="h-3 w-3 fill-gray-400 text-gray-400" />
                </div>
                <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
                <div className="w-8 text-right text-gray-400 text-xs">
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* List */}
      <div className="space-y-6">
        {reviews.map((review) => (
          <div
            key={review.id}
            className="pb-6 border-b border-gray-100 last:border-0"
          >
            <div className="flex items-start gap-4">
              <Avatar
                src={review.avatar}
                fallback={review.customerName.charAt(0)}
              />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold text-gray-900">
                    {review.customerName}
                  </h4>
                  <span className="text-xs text-gray-400">{review.date}</span>
                </div>

                <div className="flex items-center gap-0.5 mt-1 mb-2">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-200 text-gray-200"}`}
                    />
                  ))}
                </div>

                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.content}
                </p>

                {review.images && review.images.length > 0 && (
                  <div className="flex gap-2 mt-3">
                    {review.images.map((img, i) => (
                      <div
                        key={i}
                        className="h-16 w-16 rounded-lg overflow-hidden border border-gray-200 cursor-zoom-in hover:opacity-90"
                      >
                        <img
                          src={img}
                          alt="Review image"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-3">
                  <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[var(--color-primary)] transition-colors px-2 py-1 rounded bg-gray-50 hover:bg-[var(--color-primary-light)]">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    Hữu ích ({review.likes})
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
