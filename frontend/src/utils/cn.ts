import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Hàm tiện ích kết hợp class Tailwind một cách thông minh,
 * giúp xóa bỏ các class bị trùng lặp (conflict) và hỗ trợ class theo điều kiện.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
