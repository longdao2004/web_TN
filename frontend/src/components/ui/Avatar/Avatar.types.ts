import { ImgHTMLAttributes } from 'react';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Đường dẫn ảnh thật */
  src?: string;
  /** Tên dùng để tạo chữ cái viết tắt nếu ảnh lỗi hoặc không có ảnh */
  fallback?: string;
  /** Kích thước Avatar */
  size?: AvatarSize;
  /** Có bo tròn hoàn toàn không (mặc định true) */
  rounded?: boolean;
}
