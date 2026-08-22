import { CartItem } from '../types/cart';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const getHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const cartService = {
  getCart: async () => {
    const res = await fetch(`${API_URL}/cart`, { method: 'GET', headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error('Không thể tải giỏ hàng');
    }
    const data = await res.json();
    return {
      ...data,
      items: data.items.map((item: any): CartItem => ({
        id: item.cartItemId,
        productId: item.productId,
        slug: item.productId,
        name: item.productName,
        category: 'Nông sản', // Backend doesn't return this in cart
        image: item.imageUrl || '/images/products/cachuabi.avif',
        price: item.pricePerUnit,
        quantity: item.quantity,
        maxQuantity: 99, // Fallback since backend doesn't return maxQuantity in cart
        store: {
          id: '1',
          name: 'Cửa hàng',
          slug: 'cua-hang'
        }
      }))
    };
  },
  addToCart: async (productId: string, quantity: number) => {
    const res = await fetch(`${API_URL}/cart/items`, { method: 'POST', headers: getHeaders(), body: JSON.stringify({ productId, quantity }) });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error('Không thể thêm vào giỏ hàng');
    }
    return res.json();
  },
  updateCartItem: async (cartItemId: string, quantity: number) => {
    const res = await fetch(`${API_URL}/cart/items/${cartItemId}`, { method: 'PATCH', headers: getHeaders(), body: JSON.stringify({ quantity }) });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error('Không thể cập nhật số lượng');
    }
    return res.json();
  },
  removeCartItem: async (cartItemId: string) => {
    const res = await fetch(`${API_URL}/cart/items/${cartItemId}`, { method: 'DELETE', headers: getHeaders() });
    if (!res.ok) {
      if (res.status === 401) throw new Error('UNAUTHORIZED');
      throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
    }
    return res.json();
  }
};
