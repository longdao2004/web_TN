import { Store } from '../types/store';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// THÊM MỚI: Hàm đính kèm Token để Seller gọi API bảo mật
const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const storeService = {
  // ==========================================
  // PHẦN 1: CÁC HÀM CŨ CHO KHÁCH HÀNG (GIỮ NGUYÊN)
  // ==========================================
  getStores: async (filters?: { search?: string, province?: string, sort?: string }): Promise<Store[]> => {
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
      banner: '/images/products/carot.avif',
      address: item.address || 'Chưa cập nhật',
      description: item.description || '',
      certificates: [],
      productsCount: item._count?.products || item.products?.length || 0,
      rating: 5,
      reviewsCount: 0,
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
      banner: '/images/products/carot.avif',
      address: item.address || 'Chưa cập nhật',
      description: item.description || 'Cửa hàng chưa có mô tả.',
      certificates: [],
      productsCount: item._count?.products || item.products?.length || 0,
      rating: 5,
      reviewsCount: 0,
      isFeatured: false,
      joinDate: item.createdAt ? new Date(item.createdAt).toLocaleDateString("vi-VN") : 'Đang cập nhật',
    };
  },

  // ==========================================
  // PHẦN 2: THÊM MỚI 2 HÀM DÀNH CHO SELLER
  // ==========================================
  getMyStore: async () => {
    const res = await fetch(`${API_URL}/stores/my-store`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi lấy thông tin cửa hàng');
    return res.json();
  },

  updateMyStore: async (data: { name?: string; description?: string }) => {
    const res = await fetch(`${API_URL}/stores/my-store`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi cập nhật cửa hàng');
    return res.json();
  }
};