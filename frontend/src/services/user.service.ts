import { UserProfile, UpdateProfileRequest } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      if (res.status === 401) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Lỗi khi lấy thông tin người dùng');
    }
    return res.json();
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Lỗi khi cập nhật thông tin');
    }
    return res.json();
  },
};
