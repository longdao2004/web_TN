const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export interface CreateReviewDto {
  productId: string;
  rating: number;
  comment?: string;
}

export interface UpdateReviewDto {
  rating?: number;
  comment?: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}

export const reviewService = {
  getAllReviews: async (): Promise<any[]> => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error('Lỗi khi lấy đánh giá');
    return res.json();
  },

  getMyReviews: async (): Promise<Review[]> => {
    const res = await fetch(`${API_URL}/reviews/me`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi khi lấy danh sách đánh giá');
    return res.json();
  },

  createReview: async (data: CreateReviewDto) => {
    const res = await fetch(`${API_URL}/reviews`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi khi gửi đánh giá');
    return res.json();
  },

  updateReview: async (id: string, data: UpdateReviewDto) => {
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Lỗi khi cập nhật đánh giá');
    return res.json();
  },

  deleteReview: async (id: string) => {
    const res = await fetch(`${API_URL}/reviews/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error('Lỗi khi xóa đánh giá');
    return res.json();
  }
};
