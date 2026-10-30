import { UserProfile, UpdateProfileRequest, Role } from '../types/user';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = (isFormData: boolean = false) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const userService = {
  // 1. Lấy thông tin cá nhân của người dùng hiện tại
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

  // 2. Cập nhật thông tin cá nhân
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

  // ==========================================
  // DÀNH CHO QUẢN TRỊ VIÊN (ADMIN)
  // ==========================================

  // 3. Admin lấy danh sách toàn bộ người dùng trong hệ thống
  getAllUsers: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: getHeaders(false),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tải danh sách người dùng');
    }
    return res.json();
  },

  // 4. Admin cập nhật vai trò (Role) của người dùng (BUYER / SELLER / ADMIN)
  updateUserRole: async (id: string, role: Role): Promise<any> => {
    const res = await fetch(`${API_URL}/users/${id}/role`, {
      method: 'PATCH',
      headers: getHeaders(false),
      body: JSON.stringify({ role }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi cập nhật quyền người dùng');
    }
    return res.json();
  },

  // 5. Admin khóa / xóa mềm tài khoản người dùng vi phạm
  deleteUser: async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getHeaders(false),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi khóa tài khoản người dùng');
    }
    return res.json();
  },
};