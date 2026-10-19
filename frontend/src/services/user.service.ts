import { UserProfile, UpdateProfileRequest } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = (isFormData: boolean = false) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!res.ok) {
      if (res.status === 401 || res.status === 404) {
        throw new Error('UNAUTHORIZED');
      }
      throw new Error('Lỗi khi lấy thông tin người dùng');
    }
    return res.json();
  },

  updateProfile: async (data: FormData | UpdateProfileRequest): Promise<UserProfile> => {
    const isFormData = typeof FormData !== 'undefined' && data instanceof FormData;
    const res = await fetch(`${API_URL}/users/profile`, {
      method: 'PATCH',
      headers: getHeaders(isFormData),
      body: isFormData ? data : JSON.stringify(data),
    });
    if (!res.ok) {
      throw new Error('Lỗi khi cập nhật thông tin');
    }
    return res.json();
  },
};
