import React from 'react';
import { Badge } from './Badge';
import { Check, AlertTriangle, X } from 'lucide-react';

export const BadgeExample = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-sm">
      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">Đơn mới</Badge>
        <Badge variant="success">Đã giao</Badge>
        <Badge variant="warning">Sắp hết hàng</Badge>
        <Badge variant="danger">Đã hủy</Badge>
        <Badge variant="neutral">Bản nháp</Badge>
        <Badge variant="outline">Đang xử lý</Badge>
      </div>

      <div className="flex flex-wrap gap-2 items-center">
        <Badge variant="success" icon={<Check className="w-3 h-3" />}>Đã xác minh</Badge>
        <Badge variant="danger" icon={<X className="w-3 h-3" />}>Lỗi thanh toán</Badge>
        <Badge variant="warning" icon={<AlertTriangle className="w-3 h-3" />}>Chú ý</Badge>
      </div>
    </div>
  );
};
