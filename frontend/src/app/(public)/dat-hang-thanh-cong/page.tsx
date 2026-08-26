import { Metadata } from 'next';
import { PageContainer } from '@/components/layout/core';
import { mockOrderSuccess, mockTimelineSteps, mockRecommendedProducts } from '@/mock/order-success';
import {
  OrderSuccessHero,
  OrderSummary,
  DeliveryInformation,
  PurchasedProducts,
  OrderTimeline,
  ActionButtons,
  RecommendedProducts
} from '@/components/order-success';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trạng thái đơn hàng | AgriMarket',
  description: 'Trạng thái đặt hàng tại AgriMarket.',
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
  const order = mockOrderSuccess;
  const resolvedParams = await searchParams;
  
  const code = resolvedParams.code as string | undefined;
  const message = resolvedParams.message as string | undefined;
  const orderId = resolvedParams.orderId as string | undefined;
  
  const isError = code && code !== '00';

  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {isError ? (
          <div className="py-20 text-center">
            <AlertCircle className="w-20 h-20 text-red-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Thanh toán thất bại</h1>
            <p className="text-lg text-gray-600 mb-8">{message || 'Giao dịch không thành công hoặc đã bị hủy.'}</p>
            <ActionButtons />
          </div>
        ) : (
          <>
            {/* Phần Hero (Banner) */}
            <OrderSuccessHero />
            
            {/* Lưới nội dung chính */}
            <div className="max-w-5xl mx-auto mt-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Left Column (Timeline & Products) */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <OrderTimeline steps={mockTimelineSteps} />
                  <PurchasedProducts products={order.products} />
                </div>
                
                {/* Right Column (Summary & Delivery) */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                  <OrderSummary order={{...order, id: orderId || order.id}} />
                  <DeliveryInformation info={order.deliveryInfo} />
                </div>
              </div>
              
              {/* Action Buttons */}
              <ActionButtons />
            </div>
            
            {/* Recommended Products */}
            <RecommendedProducts products={mockRecommendedProducts} />
          </>
        )}
      </PageContainer>
    </div>
  );
}
