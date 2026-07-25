import React from 'react';
import Link from 'next/link';
import { SearchX, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui';

interface EmptySearchProps {
  query: string;
}

export const EmptySearch = ({ query }: EmptySearchProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in zoom-in-95 duration-700 fade-in">
      <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <SearchX className="w-20 h-20 text-gray-300" />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy kết quả</h2>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với từ khóa &quot;<span className="font-semibold text-gray-900">{query}</span>&quot;. Vui lòng thử lại với từ khóa khác hoặc kiểm tra lỗi chính tả.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/">
          <Button variant="outline" className="w-full sm:w-auto font-medium">
            <Home className="w-4 h-4 mr-2" />
            Về trang chủ
          </Button>
        </Link>
        <Link href="/san-pham">
          <Button className="w-full sm:w-auto font-medium shadow-md shadow-emerald-500/20">
            <ShoppingBag className="w-4 h-4 mr-2" />
            Xem toàn bộ sản phẩm
          </Button>
        </Link>
      </div>
    </div>
  );
};
