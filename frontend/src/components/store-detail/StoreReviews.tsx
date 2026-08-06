import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { Store } from "@/types/store";
import Image from "next/image";

export interface StoreReview {
  id: string;
  customerName: string;
  avatar?: string;
  date: string;
  rating: number;
  content: string;
}

interface StoreReviewsProps {
  store: Store;
  reviews?: StoreReview[];
}

export const StoreReviews = ({ store, reviews = [] }: StoreReviewsProps) => {
  const { statistics } = store;

  if (!statistics) return null;

  return (
    <div className="bg-white rounded-2xl p-6 sm:p-8 border border-gray-100 shadow-sm animate-in slide-in-from-bottom-8 duration-700 fade-in delay-600">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-600" />
          Đánh giá từ khách hàng
        </h2>
      </div>

      {/* Review Summary */}
      <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mb-10 items-center">
        <div className="text-center shrink-0">
          <div className="text-5xl font-black text-gray-900 mb-2">
            {statistics.averageRating}
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-5 h-5 ${star <= Math.round(statistics.averageRating) ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500">
            {statistics.totalCustomers} đánh giá
          </p>
        </div>

        <div className="flex-1 w-full flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1 w-12 shrink-0 text-gray-600 font-medium">
                {star}{" "}
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </div>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{
                    width: star === 5 ? "80%" : star === 4 ? "15%" : "2%",
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full h-px bg-gray-100 mb-8"></div>

      {/* Review List */}
      <div className="flex flex-col gap-6">
        {reviews.slice(0, 3).map((review) => (
          <div key={review.id} className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
              <Image
                src={
                  review.avatar ||
                  "/images/stores/sieuthirau.avif"
                }
                alt={review.customerName}
                className="w-full h-full object-cover"
                width={500}
                height={500}
              />
            </div>
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                <span className="font-semibold text-gray-900">
                  {review.customerName}
                </span>
                <span className="text-xs text-gray-400">{review.date}</span>
              </div>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-gray-100 text-gray-200"}`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {review.content}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button className="text-emerald-600 font-semibold text-sm hover:underline">
          Xem tất cả đánh giá
        </button>
      </div>
    </div>
  );
};
