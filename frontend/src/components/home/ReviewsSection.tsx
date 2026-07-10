import React from 'react';
import { PageContainer, Section } from '@/components/layout/core';
import { reviews } from '@/mock';
import { Star } from 'lucide-react';

export const ReviewsSection = () => {
  return (
    <Section bgClass="bg-white">
      <PageContainer>
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Khách hàng nói gì về chúng tôi?</h2>
          <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">
            Hơn 10.000+ khách hàng đã tin tưởng và sử dụng nông sản sạch từ AgriMarket.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-[var(--color-border)] bg-gray-50 p-6 transition-shadow hover:shadow-md">
              <div className="flex items-center gap-4 mb-4">
                <img src={review.avatar} alt={review.customerName} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <h4 className="font-semibold text-gray-900">{review.customerName}</h4>
                  <p className="text-xs text-gray-500">{review.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`h-4 w-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'fill-gray-200 text-gray-200'}`} 
                  />
                ))}
              </div>
              <p className="text-sm text-gray-700 italic line-clamp-3">
                "{review.content}"
              </p>
            </div>
          ))}
        </div>
      </PageContainer>
    </Section>
  );
};
