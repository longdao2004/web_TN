import { SelectHTMLAttributes } from 'react';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  /** Nhãn của Select */
  label?: string;
  /** Dòng text phụ chú thích */
  helperText?: string;
  /** Thông báo lỗi */
  error?: string;
  /** Mảng dữ liệu options */
  options: SelectOption[];
  /** Chiều rộng 100% */
  fullWidth?: boolean;
}
