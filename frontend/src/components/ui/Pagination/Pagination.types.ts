import { HTMLAttributes } from 'react';

export interface PaginationProps extends HTMLAttributes<HTMLDivElement> {
  /** Trang hiện tại (1-indexed) */
  currentPage: number;
  /** Tổng số trang */
  totalPages: number;
  /** Callback khi người dùng click chuyển trang */
  onPageChange: (page: number) => void;
  /** Có hiện nút Previous / Next chữ hay không */
  showText?: boolean;
}
