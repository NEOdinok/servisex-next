import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { PossibleOffer, CartItem } from "@/types";

interface CartState {
  items: CartItem[];
  addItem: (item: PossibleOffer | CartItem) => void;
  removeItem: (id: number) => void;
  incrementItemQuantity: (id: number) => void;
  decrementItemQuantity: (id: number) => void;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      // Update quantity if item already exists, add new item if it doesn't
      addItem: (item) =>
        set((state) => {
          const itemAlreadyInCart = state.items.find((i) => i.id === item.id);
          if (itemAlreadyInCart) {
            return {
              items: state.items.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i)),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      incrementItemQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item)),
        })),
      decrementItemQuantity: (id) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "goat-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
