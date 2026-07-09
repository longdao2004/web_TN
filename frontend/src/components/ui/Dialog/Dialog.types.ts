import { ReactNode } from 'react';
import { ModalProps } from '../Modal';

export interface DialogProps extends Omit<ModalProps, 'size' | 'children' | 'title' | 'description'> {
  /** Tiêu đề Dialog */
  title: string;
  /** Nội dung mô tả / câu hỏi xác nhận */
  description: ReactNode;
  /** Biến thể của Dialog (Danger cho hành động xóa, Warning cho cảnh báo, Info cho thông tin) */
  variant?: 'danger' | 'warning' | 'info';
  /** Nút Action chính */
  confirmText?: string;
  /** Callback khi nhấn Confirm */
  onConfirm?: () => void;
  /** Nút Hủy */
  cancelText?: string;
  /** Trạng thái loading của nút Confirm */
  isConfirmLoading?: boolean;
}
