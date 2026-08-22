import { Category } from '../types/product';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const categoryService = {
  getAllCategories: async (): Promise<Category[]> => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error('Lỗi khi lấy danh sách danh mục');
    }
    const data = await res.json();
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.id, // Fallback to id since backend lacks slug
      count: 0 // Backend lacks count
    }));
  }
};
