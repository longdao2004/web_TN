import { Store } from '../types/store';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const storeService = {
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
      joinDate: item.createdAt || '2026',
      statistics: {
        totalProducts: item._count?.products || item.products?.length || 0,
        totalSold: 100, // mock fallback
        totalCustomers: 50, // mock fallback
        responseRate: '95%',
        averageRating: 5,
      }
    };
  }
};
