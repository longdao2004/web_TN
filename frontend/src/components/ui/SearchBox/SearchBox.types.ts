import { InputHTMLAttributes } from 'react';

export interface SearchBoxProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Placeholder cho ô tìm kiếm */
  placeholder?: string;
  /** Callback khi người dùng submit (Nhấn Enter hoặc bấm nút tìm) */
  onSearch?: (value: string) => void;
  /** Nếu true, ô search sẽ có nền xám nhẹ thay vì nền trắng */
  variant?: 'outline' | 'filled';
  /** Có full-width hay không */
  fullWidth?: boolean;
}
