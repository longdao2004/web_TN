import React, { useState } from 'react';
import { Select } from './Select';

export const SelectExample = () => {
  const [val, setVal] = useState('');
  
  const sampleOptions = [
    { label: 'Cà chua Đà Lạt', value: 'tomato' },
    { label: 'Dâu tây (Hết hàng)', value: 'strawberry', disabled: true },
    { label: 'Khoai tây', value: 'potato' },
  ];

  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-md">
      <Select 
        label="Chọn nông sản" 
        options={sampleOptions} 
        value={val}
        onChange={(e) => setVal(e.target.value)}
      />
      <Select 
        label="Tỉnh/Thành phố" 
        options={[{label: 'Hà Nội', value: 'hn'}, {label: 'TP.HCM', value: 'hcm'}]} 
        error="Vui lòng chọn Tỉnh/Thành phố hợp lệ."
      />
    </div>
  );
};
