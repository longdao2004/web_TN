import React, { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../Button';

export const DialogExample = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 bg-white flex gap-4">
      <Button onClick={() => setIsOpen(true)} variant="danger">
        Xóa sản phẩm
      </Button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        variant="danger"
        title="Xóa sản phẩm này?"
        description="Hành động này không thể hoàn tác. Sản phẩm sẽ bị xóa vĩnh viễn khỏi hệ thống."
        confirmText="Xóa vĩnh viễn"
        onConfirm={() => {
          console.log('Đã xóa');
          setIsOpen(false);
        }}
      />
    </div>
  );
};
