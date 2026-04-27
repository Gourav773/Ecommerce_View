"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customerApi } from "@/lib/api";
import type { ProductListItem, WishlistItem } from "@/types";

type WishlistState = {
  items: WishlistItem[];
  hydrateFromServer: (enabled: boolean) => Promise<void>;
  toggleWishlist: (item: ProductListItem, token?: string | null) => Promise<boolean>;
  remove: (pid: string, token?: string | null) => Promise<void>;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      hydrateFromServer: async (enabled) => {
        if (!enabled) return;
        const rows = await customerApi.wishlistList();
        set({ items: rows });
      },
      toggleWishlist: async (item, token) => {
        const exists = get().items.some((w) => w.pid === item.pid);
        if (exists) {
          set((state) => ({ items: state.items.filter((w) => w.pid !== item.pid) }));
          if (token) await customerApi.wishlistRemove(item.pid);
          return false;
        }
        set((state) => ({
          items: [
            ...state.items,
            {
              pid: item.pid,
              pname: item.pname,
              image: item.image,
              price: item.price,
              discount: item.discount,
            },
          ],
        }));
        if (token) await customerApi.wishlistAdd(item.pid);
        return true;
      },
      remove: async (pid, token) => {
        set((state) => ({ items: state.items.filter((w) => w.pid !== pid) }));
        if (token) await customerApi.wishlistRemove(pid);
      },
    }),
    { name: "customer-wishlist" }
  )
);

