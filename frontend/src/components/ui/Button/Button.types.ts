// file typeScripts prop interfaces 
import { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Giao diện của nút */
  variant?: ButtonVariant;
  /** Kích thước của nút */
  size?: ButtonSize;
  /** Trạng thái đang tải (hiện spinner, disable click) */
  isLoading?: boolean;
  /** Icon nằm bên trái text */
  leftIcon?: ReactNode;
  /** Icon nằm bên phải text */
  rightIcon?: ReactNode;
  /** Nút hiển thị toàn chiều rộng 100% */
  fullWidth?: boolean;
}
