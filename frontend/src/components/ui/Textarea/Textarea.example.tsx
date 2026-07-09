import React from 'react';
import { Textarea } from './Textarea';

export const TextareaExample = () => {
  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-md">
      <Textarea 
        label="Mô tả sản phẩm" 
        placeholder="Nhập mô tả chi tiết về sản phẩm..." 
        rows={4}
      />
      <Textarea 
        label="Ghi chú đơn hàng" 
        placeholder="Lưu ý cho người giao hàng..." 
        helperText="Không bắt buộc."
      />
      <Textarea 
        label="Lý do hủy đơn" 
        error="Vui lòng nhập lý do hủy đơn (Tối thiểu 10 ký tự)."
      />
    </div>
  );
};
