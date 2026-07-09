import { HTMLAttributes } from 'react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastProps extends HTMLAttributes<HTMLDivElement> {
  /** Tiêu đề chính của Toast */
  title: string;
  /** Mô tả chi tiết */
  description?: string;
  /** Loại thông báo (Thành công, Lỗi...) */
  variant?: ToastVariant;
  /** Callback khi người dùng nhấn nút X tắt Toast */
  onClose?: () => void;
}
