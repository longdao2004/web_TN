import { HTMLAttributes, ReactNode } from 'react';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon hiển thị (Kích thước lớn) */
  icon?: ReactNode;
  /** Tiêu đề chính */
  title: string;
  /** Mô tả phụ */
  description?: string;
  /** Nút Action (ví dụ: Tạo mới, Tải lại) */
  action?: ReactNode;
}
