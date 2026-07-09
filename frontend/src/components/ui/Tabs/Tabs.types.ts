import { HTMLAttributes, ReactNode } from 'react';

export interface TabItem {
  id: string;
  label: ReactNode;
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  /** Danh sách các Tabs */
  items: TabItem[];
  /** Tab ID mặc định được kích hoạt */
  defaultActiveId?: string;
  /** Nếu true, Tabs sẽ dàn trải đều (fullWidth) */
  fullWidth?: boolean;
}
