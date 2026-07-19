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

export const metadata: Metadata = {
  title: 'Đặt hàng thành công | Sàn Nông Sản',
  description: 'Cảm ơn bạn đã mua sắm tại AgriMarket.',
};

export default function OrderSuccessPage() {
  const order = mockOrderSuccess;
  
  return (
    <div className="bg-gray-50/50 min-h-screen pb-12 overflow-x-hidden">
      <PageContainer>
        
        {/* Hero Section */}
        <OrderSuccessHero />
        
        {/* Main Content Grid */}
        <div className="max-w-5xl mx-auto mt-2">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Left Column (Timeline & Products) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <OrderTimeline steps={mockTimelineSteps} />
              <PurchasedProducts products={order.products} />
            </div>
            
            {/* Right Column (Summary & Delivery) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <OrderSummary order={order} />
              <DeliveryInformation info={order.deliveryInfo} />
            </div>
            
          </div>
          
          {/* Action Buttons */}
          <ActionButtons />
          
        </div>
        
        {/* Recommended Products */}
        <RecommendedProducts products={mockRecommendedProducts} />
        
      </PageContainer>
    </div>
  );
}
