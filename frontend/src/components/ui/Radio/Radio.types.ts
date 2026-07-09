import { InputHTMLAttributes } from 'react';

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /** Nhãn hiển thị kế bên radio */
  label?: string;
  /** Chú thích phụ */
  helperText?: string;
  /** Thông báo lỗi */
  error?: string;
}
