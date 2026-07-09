import React, { useState } from 'react';
import { Switch } from './Switch';

export const SwitchExample = () => {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-sm border rounded-md">
      <Switch 
        checked={enabled}
        onCheckedChange={setEnabled}
        label="Nhận thông báo qua email"
        helperText="Nhận các chương trình khuyến mãi mới nhất"
      />
      
      <Switch 
        checked={true}
        disabled
        label="Tính năng tự động cập nhật"
        helperText="Không thể thay đổi"
      />
    </div>
  );
};
