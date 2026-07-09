import { InputHTMLAttributes, ReactNode } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Nhãn (Label) của Input */
  label?: string;
  /** Dòng text phụ chú thích ở dưới Input */
  helperText?: string;
  /** Thông báo lỗi (sẽ làm Input có viền đỏ) */
  error?: string;
  /** Icon hiển thị ở bên trái (ví dụ: Search icon) */
  leftIcon?: ReactNode;
  /** Icon hiển thị ở bên phải (ví dụ: Icon con mắt bật/tắt password) */
  rightIcon?: ReactNode;
  /** Chiều rộng 100% */
  fullWidth?: boolean;
}
