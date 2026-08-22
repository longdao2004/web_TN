import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import { cartService } from '@/services/cart.service';

interface CartState {
  items: CartItem[];
  totalItems: number;
  buyNowItem: CartItem | null;
  fetchCart: () => Promise<void>;
  addItem: (item: CartItem, quantity: number) => Promise<boolean>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  setBuyNowItem: (item: CartItem) => void;
  clearBuyNowItem: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: [],
  totalItems: 0,
  buyNowItem: null,

  fetchCart: async () => {
    try {
      const data = await cartService.getCart();
      set({ items: data.items, totalItems: data.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
    } catch (e) {
      console.error(e);
      set({ items: [], totalItems: 0 });
    }
  },

  addItem: async (newItem, quantity) => {
    try {
      await cartService.addToCart(newItem.id, quantity);
      const data = await cartService.getCart();
      set({ items: data.items, totalItems: data.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  },

  removeItem: async (id) => {
    try {
      await cartService.removeCartItem(id);
      const data = await cartService.getCart();
      set({ items: data.items, totalItems: data.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
    } catch (e) {
      console.error(e);
    }
  },

  updateQuantity: async (id, quantity) => {
    try {
      await cartService.updateCartItem(id, quantity);
      const data = await cartService.getCart();
      set({ items: data.items, totalItems: data.items.reduce((acc: number, item: CartItem) => acc + item.quantity, 0) });
    } catch (e) {
      console.error(e);
    }
  },

  clearCart: () => set({ items: [], totalItems: 0 }),
  
  setBuyNowItem: (item) => set({ buyNowItem: item }),
  
  clearBuyNowItem: () => set({ buyNowItem: null })
}));
