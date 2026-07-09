import { TextareaHTMLAttributes } from 'react';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Nhãn (Label) của Textarea */
  label?: string;
  /** Dòng text phụ chú thích ở dưới */
  helperText?: string;
  /** Thông báo lỗi (sẽ làm Textarea có viền đỏ) */
  error?: string;
  /** Chiều rộng 100% */
  fullWidth?: boolean;
}
