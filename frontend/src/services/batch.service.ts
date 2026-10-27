const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const batchService = {
  // 1. Tạo lô hàng mới
  createBatch: async (data: {
    productId: string;
    harvestDate: string;
    expiryDate: string;
    quantity: number;
    price: number;
  }) => {
    const res = await fetch(`${API_URL}/product-batches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tạo lô hàng');
    }
    return res.json();
  },

  // 2. Cập nhật thông tin lô hàng (Sửa giá, tồn kho, ngày thu hoạch, HSD)
  updateBatch: async (
    id: string,
    data: {
      harvestDate?: string;
      expiryDate?: string;
      quantity?: number;
      price?: number;
    },
  ) => {
    const res = await fetch(`${API_URL}/product-batches/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi cập nhật lô hàng');
    }
    return res.json();
  },

  // 3. Xóa lô hàng
  deleteBatch: async (id: string) => {
    const res = await fetch(`${API_URL}/product-batches/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi xóa lô hàng');
    }
    return res.json();
  },
};