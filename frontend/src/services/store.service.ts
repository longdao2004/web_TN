import { Store } from '../types/store';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const storeService = {
  // ==========================================
  // PHẦN 1: DÀNH CHO KHÁCH HÀNG
  // ==========================================
  getStores: async (filters?: { search?: string; province?: string; sort?: string }): Promise<Store[]> => {
    let url = `${API_URL}/stores`;
    if (filters) {
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.province) params.append('province', filters.province);
      if (filters.sort) params.append('sort', filters.sort);
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
    }
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách cửa hàng');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      slug: item.id,
      name: item.name,
      logo: item.logoUrl || '/images/products/cachuabi.avif',
      banner: item.coverUrl || '/images/banners/chorau.avif',
      address: item.address || 'Chưa cập nhật',
      phone: item.phone,
      email: item.email,
      website: item.website,
      description: item.description || '',
      certificates: [],
      productsCount: item._count?.products || item.products?.length || 0,
      rating: item.rating !== undefined ? item.rating : 5,
      reviewsCount: item.reviewsCount !== undefined ? item.reviewsCount : 0,
      isFeatured: false,
    }));
  },

  getStoreById: async (id: string): Promise<Store> => {
    const res = await fetch(`${API_URL}/stores/${id}`, { method: 'GET' });
    if (!res.ok) throw new Error('Lỗi khi lấy thông tin cửa hàng');
    const item = await res.json();

    return {
      id: item.id,
      slug: item.id,
      name: item.name,
      logo: item.logoUrl || '/images/products/cachuabi.avif',
      banner: item.coverUrl || '/images/products/carot.avif',
      address: item.address || 'Chưa cập nhật',
      phone: item.phone,
      email: item.email,
      website: item.website,
      description: item.description || 'Cửa hàng chưa có mô tả.',
      certificates: [],
      productsCount: item._count?.products || item.products?.length || 0,
      rating: item.rating !== undefined ? item.rating : 5,
      reviewsCount: item.reviewsCount !== undefined ? item.reviewsCount : 0,
      isFeatured: false,
      joinDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString('vi-VN') : 'Đang cập nhật',
    };
  },

  // ==========================================
  // PHẦN 2: DÀNH CHO SELLER
  // ==========================================
  getMyStore: async () => {
    try {
      const res = await fetch(`${API_URL}/stores/my-store`, {
        method: 'GET',
        headers: getHeaders(),
      });
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  },

  updateMyStore: async (data: FormData) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetch(`${API_URL}/stores/my-store`, {
      method: 'PATCH',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: data,
    });
    if (!res.ok) throw new Error('Lỗi cập nhật cửa hàng');
    return res.json();
  },

  createStore: async (data: {
    name: string;
    description?: string;
    address?: string;
    phone?: string;
    email?: string;
  }) => {
    const res = await fetch(`${API_URL}/stores`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tạo cửa hàng');
    }
    return res.json();
  },

  // ==========================================
  // PHẦN 3: DÀNH CHO ADMIN
  // ==========================================
  getAllStoresForAdmin: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/stores`, {
      method: 'GET',
    });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách cửa hàng');
    return res.json();
  },

  deleteStore: async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/stores/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi khóa cửa hàng');
    }
    return res.json();
  },
};