import { HTMLAttributes, ReactNode } from 'react';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps extends HTMLAttributes<HTMLDivElement> {
  /** Nội dung hiển thị bên trong tooltip (chữ hoặc node) */
  content: ReactNode;
  /** Component con cần được gắn tooltip */
  children: ReactNode;
  /** Vị trí hiển thị của Tooltip */
  position?: TooltipPosition;
}
