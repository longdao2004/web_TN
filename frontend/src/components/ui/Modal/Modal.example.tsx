import React, { useState } from 'react';
import { Modal } from './Modal';
import { Button } from '../Button';

export const ModalExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 bg-white">
      <Button onClick={() => setIsOpen(true)}>Mở Modal Cập nhật</Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Cập nhật thông tin cửa hàng"
        description="Thay đổi sẽ được áp dụng ngay lập tức trên hệ thống."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Hủy bỏ</Button>
            <Button variant="primary" onClick={() => setIsOpen(false)}>Lưu thay đổi</Button>
          </>
        }
      >
        <div className="flex flex-col gap-4 py-2">
          <p className="text-sm text-[var(--color-text-primary)]">
            Đây là phần nội dung bên trong Body của Modal. Bạn có thể nhúng Form, Table, 
            hoặc bất kỳ Component nào vào khu vực này.
          </p>
        </div>
      </Modal>
    </div>
  );
};
