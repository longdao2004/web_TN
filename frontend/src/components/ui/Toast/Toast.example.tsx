import React from 'react';
import { Toast } from './Toast';

export const ToastExample = () => {
  return (
    <div className="flex flex-col gap-4 p-8 bg-gray-50 items-end">
      <Toast 
        variant="success" 
        title="Thành công!" 
        description="Đơn hàng của bạn đã được thanh toán." 
        onClose={() => console.log('closed')}
      />
      <Toast 
        variant="error" 
        title="Đăng nhập thất bại" 
        description="Mật khẩu không chính xác, vui lòng thử lại." 
        onClose={() => console.log('closed')}
      />
      <Toast 
        variant="warning" 
        title="Sắp hết phiên" 
        description="Phiên đăng nhập của bạn sẽ hết hạn trong 5 phút." 
        onClose={() => console.log('closed')}
      />
      <Toast 
        variant="info" 
        title="Có cập nhật mới" 
        description="Hệ thống vừa cập nhật phiên bản 2.0" 
        onClose={() => console.log('closed')}
      />
    </div>
  );
};
