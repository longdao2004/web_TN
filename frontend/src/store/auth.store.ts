import { create } from 'zustand';
import { userService } from '@/services/user.service';
import { UserProfile } from '@/types/user';

interface AuthState {
  token: string | null;
  user: UserProfile | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  fetchUser: () => Promise<void>;
  logout: () => void;
}

import { useCartStore } from './useCartStore';

export const useAuthStore = create<AuthState>((set, get) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  user: null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
  setToken: (token) => {
    if (token) {
      if (typeof window !== 'undefined') localStorage.setItem('token', token);
      set({ token, isAuthenticated: true });
      get().fetchUser();
    } else {
      if (typeof window !== 'undefined') localStorage.removeItem('token');
      set({ token: null, user: null, isAuthenticated: false });
      // Xóa giỏ hàng local khi set token null (đăng xuất)
      useCartStore.getState().clearCart();
    }
  },
  fetchUser: async () => {
    try {
      if (!get().token) return;
      const user = await userService.getProfile();
      set({ user, isAuthenticated: true });
    } catch (error) {
      console.error("Failed to fetch user profile", error);
      if (error instanceof Error && error.message === 'UNAUTHORIZED') {
        get().logout();
      }
    }
  },
  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('token');
    set({ token: null, user: null, isAuthenticated: false });
    // Bắt buộc làm sạch giỏ hàng khi người dùng đăng xuất để tránh rò rỉ dữ liệu
    useCartStore.getState().clearCart();
  },
}));
