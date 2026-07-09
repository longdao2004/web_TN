import React from 'react';
import { Tabs } from './Tabs';

export const TabsExample = () => {
  const tabsData = [
    {
      id: 'details',
      label: 'Chi tiết sản phẩm',
      content: <div className="p-4 border rounded-md">Đây là mô tả chi tiết của Cà Chua Đà Lạt...</div>
    },
    {
      id: 'reviews',
      label: 'Đánh giá (12)',
      content: <div className="p-4 border rounded-md">Danh sách các đánh giá của khách hàng.</div>
    },
    {
      id: 'shipping',
      label: 'Giao hàng',
      disabled: true,
      content: <div>Nội dung này bị khóa</div>
    }
  ];

  return (
    <div className="p-8 bg-white max-w-md">
      <Tabs items={tabsData} defaultActiveId="details" fullWidth />
    </div>
  );
};
