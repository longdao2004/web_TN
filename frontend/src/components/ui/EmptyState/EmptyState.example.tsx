import React from 'react';
import { EmptyState } from './EmptyState';
import { Button } from '../Button';
import { ShoppingBag, SearchX } from 'lucide-react';

export const EmptyStateExample = () => {
  return (
    <div className="flex flex-col gap-8 p-8 bg-white">
      <EmptyState 
        icon={<ShoppingBag className="h-8 w-8" />}
        title="Giỏ hàng trống"
        description="Chưa có sản phẩm nào trong giỏ hàng của bạn. Hãy dạo một vòng và mua sắm nhé."
        action={<Button variant="primary">Tiếp tục mua sắm</Button>}
      />

      <EmptyState 
        icon={<SearchX className="h-8 w-8" />}
        title="Không tìm thấy kết quả"
        description="Chúng tôi không tìm thấy sản phẩm nào khớp với từ khóa của bạn."
      />
    </div>
  );
};
