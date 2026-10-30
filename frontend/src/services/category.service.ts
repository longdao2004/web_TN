const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const categoryService = {
  // 1. Lấy tất cả danh mục (kèm số lượng sản phẩm thực tế)
  getAllCategories: async (): Promise<any[]> => {
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
      description: item.description || '',
      count: item._count?.products ?? 0,
      createdAt: item.createdAt,
    }));
  },

  // 2. Admin tạo danh mục mới
  createCategory: async (data: { name: string; description?: string }): Promise<any> => {
    const res = await fetch(`${API_URL}/categories`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tạo danh mục');
    }
    return res.json();
  },

  // 3. Admin cập nhật danh mục
  updateCategory: async (id: string, data: { name: string; description?: string }): Promise<any> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi cập nhật danh mục');
    }
    return res.json();
  },

  // 4. Admin xóa danh mục
  deleteCategory: async (id: string): Promise<any> => {
    const res = await fetch(`${API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi xóa danh mục');
    }
    return res.json();
  },
};