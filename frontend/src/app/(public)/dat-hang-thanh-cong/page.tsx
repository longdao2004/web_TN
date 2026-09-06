import { Metadata } from 'next';
import { Suspense } from 'react';
import { OrderSuccessClient } from './OrderSuccessClient';
import { Loader2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Trạng thái đơn hàng | AgriMarket',
  description: 'Trạng thái đặt hàng tại AgriMarket.',
};

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    }>
      <OrderSuccessClient />
    </Suspense>
  );
}
