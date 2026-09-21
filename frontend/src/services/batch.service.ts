const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const batchService = {
  // Tạo lô hàng mới
  createBatch: async (data: { productId: string; harvestDate: string; expiryDate: string; quantity: number; price: number }) => {
    const res = await fetch(`${API_URL}/product-batches`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi tạo lô hàng');
    }
    return res.json();
  }
};