import { HTMLAttributes, ReactNode } from 'react';

export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral' | 'outline';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  /** Giao diện của Badge */
  variant?: BadgeVariant;
  /** Kích thước */
  size?: BadgeSize;
  /** Icon hiển thị bên trái */
  icon?: ReactNode;
}
