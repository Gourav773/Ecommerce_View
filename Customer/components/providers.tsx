"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import { useUIStore } from "@/store/ui-store";
import { Toaster } from "@/components/ui/toaster";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const theme = useUIStore((s) => s.theme);
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);
  const fetchMe = useAuthStore((s) => s.fetchMe);
  const hydrateCart = useCartStore((s) => s.hydrateFromServer);
  const hydrateWishlist = useWishlistStore((s) => s.hydrateFromServer);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (!hydrated) return;
    if (token) {
      fetchMe();
      hydrateCart(true);
      hydrateWishlist(true);
    }
  }, [hydrated, token, fetchMe, hydrateCart, hydrateWishlist]);

  return (
    <>
      {children}
      <Toaster />
    </>
  );
}

