import { ButtonHTMLAttributes } from 'react';

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange' | 'value'> {
  /** Trạng thái bật/tắt */
  checked?: boolean;
  /** Callback khi thay đổi trạng thái */
  onCheckedChange?: (checked: boolean) => void;
  /** Nhãn hiển thị bên cạnh switch */
  label?: string;
  /** Chú thích mờ ở dưới label */
  helperText?: string;
}
