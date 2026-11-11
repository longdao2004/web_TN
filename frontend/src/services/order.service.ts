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

  // 2. Cập nhật trạng thái đơn hàng (Xác nhận, Đang giao, Hủy kèm lý do, v.v...)
  updateOrderStatus: async (orderId: string, status: string, cancelReason?: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ status, ...(cancelReason ? { cancelReason } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi cập nhật trạng thái đơn hàng');
    }
    return res.json();
  },

  // 2b. Admin gửi nhắc nhở thủ công tới Gian hàng
  remindOrder: async (orderId: string, message?: string) => {
    const res = await fetch(`${API_URL}/orders/${orderId}/remind`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ ...(message ? { message } : {}) }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Lỗi gửi nhắc nhở đơn hàng');
    }
    return res.json();
  },

  createOrder: async (data: {
    shippingAddress: string;
    phone: string;
    shippingFee?: number;
    storeShippingFees?: Record<string, number>;
    productId?: string;
    quantity?: number;
    cartItemIds?: string[];
  }) => {
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

  // 🟢 Tạo URL thanh toán VNPay hoặc xác nhận COD (Hỗ trợ danh sách đơn hàng con khi giỏ hàng có nhiều shop)
  createPaymentUrl: async (data: {
    orderId: string;
    orderIds?: string[];
    provider: 'COD' | 'VNPAY';
  }) => {
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
