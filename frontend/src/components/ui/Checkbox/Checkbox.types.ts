import { InputHTMLAttributes } from 'react';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Nhãn hiển thị kế bên checkbox */
  label?: string;
  /** Chú thích mờ ở dưới label */
  helperText?: string;
  /** Báo lỗi viền đỏ và text đỏ */
  error?: string;
}
