import { HTMLAttributes, ReactNode } from 'react';

export interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  /** Quản lý trạng thái mở/đóng Modal */
  isOpen: boolean;
  /** Hàm callback để đóng Modal */
  onClose: () => void;
  /** Tiêu đề Modal */
  title?: string;
  /** Mô tả phụ dưới tiêu đề */
  description?: string;
  /** Khu vực Footer (chứa các nút Action) */
  footer?: ReactNode;
  /** Độ rộng của Modal */
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  /** Ngăn chặn đóng khi click ra ngoài backdrop */
  preventCloseOnOutsideClick?: boolean;
}
