import React, { useState } from 'react';
import { Input } from './Input';
import { Mail, Lock, Search, Eye, EyeOff } from 'lucide-react';

export const InputExample = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-8 bg-white max-w-md">
      {/* 1. Input cơ bản */}
      <Input 
        label="Họ và tên" 
        placeholder="Nhập họ và tên của bạn" 
        required 
      />

      {/* 2. Input với Helper text */}
      <Input 
        label="Email" 
        type="email" 
        placeholder="example@gmail.com"
        helperText="Chúng tôi sẽ không chia sẻ email của bạn với bất kỳ ai."
        leftIcon={<Mail className="w-4 h-4" />}
      />

      {/* 3. Input Mật khẩu với Icon toggle */}
      <Input 
        label="Mật khẩu" 
        type={showPassword ? "text" : "password"} 
        placeholder="Nhập mật khẩu"
        leftIcon={<Lock className="w-4 h-4" />}
        rightIcon={
          <button 
            type="button" 
            onClick={() => setShowPassword(!showPassword)}
            className="hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      {/* 4. Input Báo lỗi */}
      <Input 
        label="Số điện thoại" 
        type="tel" 
        placeholder="09xx xxx xxx"
        error="Số điện thoại không hợp lệ. Vui lòng kiểm tra lại."
      />

      {/* 5. Input Disabled */}
      <Input 
        label="Mã giảm giá" 
        placeholder="Nhập mã giảm giá"
        disabled
        helperText="Chương trình đã kết thúc."
      />

      {/* 6. Input Tìm kiếm */}
      <Input 
        placeholder="Tìm kiếm sản phẩm, danh mục..."
        leftIcon={<Search className="w-4 h-4" />}
      />
    </div>
  );
};
