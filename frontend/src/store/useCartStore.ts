import { create } from 'zustand';
import { CartItem } from '@/types/cart';
import { mockCartItems } from '@/mock/cart';

interface CartState {
  items: CartItem[];
  totalItems: number;
  addItem: (item: CartItem, quantity: number) => boolean;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  items: mockCartItems,
  totalItems: mockCartItems.reduce((acc, item) => acc + item.quantity, 0),

  addItem: (newItem, quantity) => {
    let isUpdated = false;
    set((state) => {
      const existingItem = state.items.find(item => item.id === newItem.id);
      
      let newItems;
      if (existingItem) {
        isUpdated = true;
        newItems = state.items.map(item => 
          item.id === newItem.id 
            ? { ...item, quantity: Math.min(item.quantity + quantity, item.maxQuantity) } 
            : item
        );
      } else {
        newItems = [...state.items, { ...newItem, quantity: Math.min(quantity, newItem.maxQuantity) }];
      }

      return {
        items: newItems,
        totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0)
      };
    });
    return isUpdated;
  },

  removeItem: (id) => {
    set((state) => {
      const newItems = state.items.filter(item => item.id !== id);
      return {
        items: newItems,
        totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0)
      };
    });
  },

  updateQuantity: (id, quantity) => {
    set((state) => {
      const newItems = state.items.map(item => 
        item.id === id ? { ...item, quantity } : item
      );
      return {
        items: newItems,
        totalItems: newItems.reduce((acc, item) => acc + item.quantity, 0)
      };
    });
  },

  clearCart: () => set({ items: [], totalItems: 0 })
}));
