import { Store } from '../types/store';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const storeService = {
  getStores: async (): Promise<Store[]> => {
    const res = await fetch(`${API_URL}/stores`, { method: 'GET' });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách cửa hàng');
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      slug: item.id, // Fallback to id
      name: item.name,
      logo: '/images/products/cachuabi.avif', // Placeholder
      banner: '/images/products/carot.avif', // Placeholder
      address: item.address || 'Chưa cập nhật',
      description: item.description || '',
      certificates: [], // Mock empty array to prevent crash
      productsCount: item._count?.products || 0,
      rating: 5,
      reviewsCount: 0,
      isFeatured: false,
    }));
  }
};
