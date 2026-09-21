const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const orderService = {
  // 1. Lấy danh sách đơn hàng thuộc về cửa hàng của mình
  getStoreOrders: async () => {
    const res = await fetch(`${API_URL}/orders/store`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi lấy danh sách đơn hàng cửa hàng');
    }
    return res.json();
  },

  // 2. Cập nhật trạng thái đơn hàng (Xác nhận, Đang giao, v.v...)
  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi cập nhật trạng thái đơn hàng');
    }
    return res.json();
  },

    createOrder: async (data: { shippingAddress: string; phone: string; productId?: string; quantity?: number }) => {
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
  },

  getOrderById: async (orderId: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi lấy chi tiết đơn hàng');
    }
    return res.json();
  },

    cancelOrder: async (orderId: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PATCH',
      headers: getHeaders(),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi hủy đơn hàng');
    }
    return res.json();
  },
};
