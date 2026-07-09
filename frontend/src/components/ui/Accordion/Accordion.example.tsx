import React from 'react';
import { Accordion } from './Accordion';

export const AccordionExample = () => {
  const faqs = [
    {
      id: 'item-1',
      title: 'Nông sản có đạt chuẩn VietGAP không?',
      content: 'Hoàn toàn đạt chuẩn. Tất cả sản phẩm đều có giấy chứng nhận VietGAP hoặc GlobalGAP được đính kèm trên từng lô hàng.'
    },
    {
      id: 'item-2',
      title: 'Thời gian giao hàng mất bao lâu?',
      content: 'Giao hàng hỏa tốc trong nội thành mất 2 giờ. Đối với các tỉnh thành khác mất từ 1-2 ngày.'
    },
    {
      id: 'item-3',
      title: 'Chính sách hoàn trả như thế nào?',
      content: 'Đổi trả miễn phí 100% trong vòng 24h nếu phát hiện hàng hư hỏng, dập nát.'
    }
  ];

  return (
    <div className="p-8 bg-gray-50 max-w-lg">
      <h3 className="text-lg font-bold mb-4">Câu hỏi thường gặp</h3>
      <Accordion items={faqs} allowMultiple />
    </div>
  );
};
