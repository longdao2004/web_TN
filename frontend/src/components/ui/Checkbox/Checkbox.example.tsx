import React, { useState } from 'react';
import { Checkbox } from './Checkbox';

export const CheckboxExample = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4 p-8 bg-white max-w-sm">
      <Checkbox 
        label="Tôi đồng ý với điều khoản sử dụng" 
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
      <Checkbox 
        label="Ghi nhớ đăng nhập" 
        helperText="Không nên dùng trên máy tính công cộng"
      />
      <Checkbox 
        label="Đăng ký nhận bản tin" 
        disabled
      />
      <Checkbox 
        label="Xác nhận đủ 18 tuổi" 
        error="Bạn phải xác nhận điều kiện này"
      />
    </div>
  );
};
