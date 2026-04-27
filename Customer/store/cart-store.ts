"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customerApi } from "@/lib/api";
import type { CartApiItem, CartItem, ProductListItem } from "@/types";

type CartState = {
  items: CartItem[];
  loading: boolean;
  setLoading: (loading: boolean) => void;
  hydrateFromServer: (enabled: boolean) => Promise<void>;
  addItem: (item: ProductListItem, token?: string | null) => Promise<void>;
  updateQty: (pid: string, quantity: number, token?: string | null) => Promise<void>;
  removeItem: (pid: string, token?: string | null) => Promise<void>;
  clear: (token?: string | null) => Promise<void>;
};

function mapServerItem(item: CartApiItem): CartItem {
  return {
    pid: item.pid,
    quantity: Number(item.quantity || 1),
    pname: item.pname,
    price: Number(item.price || 0),
    discount: Number(item.discount || 0),
    image: item.image,
  };
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      loading: false,
      setLoading: (loading) => set({ loading }),
      hydrateFromServer: async (enabled) => {
        if (!enabled) return;
        set({ loading: true });
        try {
          const rows = await customerApi.cartList();
          set({ items: rows.map(mapServerItem) });
        } finally {
          set({ loading: false });
        }
      },
      addItem: async (product, token) => {
        const next = [...get().items];
        const existing = next.find((item) => item.pid === product.pid);
        if (existing) existing.quantity += 1;
        else {
          next.push({
            pid: product.pid,
            quantity: 1,
            pname: product.pname,
            price: Number(product.price || 0),
            discount: Number(product.discount || 0),
            image: product.image,
          });
        }
        set({ items: next });
        if (token) await customerApi.cartAdd(product.pid, 1);
      },
      updateQty: async (pid, quantity, token) => {
        const safeQty = Math.max(1, quantity);
        set((state) => ({
          items: state.items.map((item) => (item.pid === pid ? { ...item, quantity: safeQty } : item)),
        }));
        if (token) await customerApi.cartUpdate(pid, safeQty);
      },
      removeItem: async (pid, token) => {
        set((state) => ({ items: state.items.filter((item) => item.pid !== pid) }));
        if (token) await customerApi.cartRemove(pid);
      },
      clear: async (token) => {
        set({ items: [] });
        if (token) await customerApi.cartClear();
      },
    }),
    { name: "customer-cart" }
  )
);

