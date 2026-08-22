const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const orderService = {
  createOrder: async (data: { shippingAddress: string; phone: string }) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi tạo đơn hàng');
    }
    return res.json();
  },

  createPaymentUrl: async (data: { orderId: string; provider: 'COD' | 'VNPAY' }) => {
    const res = await fetch(`${API_URL}/payments/create-url`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi tạo thanh toán');
    }
    return res.json();
  },

  getOrderHistory: async () => {
    const res = await fetch(`${API_URL}/orders/history`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi lấy lịch sử đơn hàng');
    }
    return res.json();
  }
};
