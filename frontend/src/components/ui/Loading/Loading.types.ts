import { HTMLAttributes } from 'react';

export interface LoadingProps extends HTMLAttributes<HTMLDivElement> {
  /** Loại loading (Spinner xoay hoặc Progress bar) */
  variant?: 'spinner' | 'progress';
  /** Kích thước (Chỉ áp dụng cho Spinner) */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Màu sắc (Mặc định là Primary) */
  colorClass?: string;
  /** Giá trị phần trăm cho Progress bar (Nếu không có sẽ tự chạy vô tận) */
  value?: number;
}
