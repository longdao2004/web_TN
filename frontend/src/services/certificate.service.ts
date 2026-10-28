const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const certificateService = {
  // 1. Tạo chứng nhận mới
  createCertificate: async (data: {
    productId: string;
    name: string;
    issuer?: string;
    issueDate: string;
    expiryDate?: string;
    imageUrl?: string;
  }) => {
    const res = await fetch(`${API_URL}/certificates`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi tạo chứng nhận');
    }
    return res.json();
  },

  // 2. Cập nhật thông tin chứng nhận (Sửa tên chứng nhận, ngày cấp, ảnh)
  updateCertificate: async (
    id: string,
    data: {
      name?: string;
      issuer?: string;
      issueDate?: string;
      expiryDate?: string;
      imageUrl?: string;
    },
  ) => {
    const res = await fetch(`${API_URL}/certificates/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi cập nhật chứng nhận');
    }
    return res.json();
  },

  // 3. Xóa chứng nhận khỏi sản phẩm
  deleteCertificate: async (id: string) => {
    const res = await fetch(`${API_URL}/certificates/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Lỗi khi xóa chứng nhận');
    }
    return res.json();
  },
};