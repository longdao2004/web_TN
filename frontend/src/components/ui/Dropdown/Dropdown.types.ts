import { HTMLAttributes, ReactNode } from 'react';

export interface DropdownItem {
  label: ReactNode;
  icon?: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
  divider?: boolean;
}

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  /** Component dùng để kích hoạt Dropdown (Nút nhấn, Avatar...) */
  trigger: ReactNode;
  /** Danh sách các menu items */
  items: DropdownItem[];
  /** Vị trí hiển thị (Mặc định: bottom-right) */
  align?: 'left' | 'right';
}
