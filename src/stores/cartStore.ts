import { create } from 'zustand';
import type { CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  meetingId: number | null;
  addItem: (item: CartItem) => void;
  removeItem: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  clear: () => void;
  setMeetingId: (id: number) => void;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  meetingId: null,

  addItem: (item) => {
    set((state) => {
      const existing = state.items.find((i) => i.menuId === item.menuId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuId === item.menuId
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, item] };
    });
  },

  removeItem: (menuId) => {
    set((state) => ({
      items: state.items.filter((i) => i.menuId !== menuId),
    }));
  },

  updateQuantity: (menuId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(menuId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuId === menuId ? { ...i, quantity } : i
      ),
    }));
  },

  clear: () => set({ items: [], meetingId: null }),

  setMeetingId: (id) => set({ meetingId: id }),

  totalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
