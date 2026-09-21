const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const certificateService = {
  createCertificate: async (data: { productId: string; name: string; issuer: string; issueDate: string; expiryDate: string; imageUrl?: string }) => {
    const res = await fetch(`${API_URL}/certificates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi khi tạo chứng nhận');
    }
    return res.json();
  }
};