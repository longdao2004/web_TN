import React, { useState } from 'react';
import { Radio } from './Radio';

export const RadioExample = () => {
  const [selected, setSelected] = useState('cod');

  return (
    <div className="flex flex-col gap-4 p-8 bg-white max-w-sm border rounded-md">
      <h3 className="text-sm font-bold mb-2">Phương thức thanh toán</h3>
      
      <Radio 
        name="payment"
        value="cod"
        checked={selected === 'cod'}
        onChange={(e) => setSelected(e.target.value)}
        label="Thanh toán khi nhận hàng (COD)" 
        helperText="Thanh toán bằng tiền mặt khi giao hàng"
      />
      
      <Radio 
        name="payment"
        value="vnpay"
        checked={selected === 'vnpay'}
        onChange={(e) => setSelected(e.target.value)}
        label="Thanh toán VNPay" 
      />

      <Radio 
        name="payment"
        value="momo"
        disabled
        label="Ví MoMo (Bảo trì)" 
      />
    </div>
  );
};
