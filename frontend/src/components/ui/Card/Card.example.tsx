import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './Card';
import { Button } from '../Button';

export const CardExample = () => {
  return (
    <div className="p-8 bg-gray-50 flex gap-6 flex-wrap">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Tổng doanh thu</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">Tháng 7, 2026</p>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">120,500,000 đ</p>
          <p className="text-xs text-[var(--color-success)] mt-1">+15% so với tháng trước</p>
        </CardContent>
      </Card>

      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Tạo chiến dịch mới</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--color-text-secondary)]">Khởi tạo chương trình khuyến mãi cho mùa trung thu.</p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="ghost">Hủy</Button>
          <Button variant="primary">Tiếp tục</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
