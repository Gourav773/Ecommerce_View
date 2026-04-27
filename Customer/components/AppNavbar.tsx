"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { customerApi } from "@/lib/api";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductListItem } from "@/types";
import ThemeToggle from "@/components/shared/theme-toggle";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/wishlist", label: "Wishlist" },
  { href: "/orders", label: "Orders" },
];

export default function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<ProductListItem[]>([]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const token = useAuthStore((s) => s.token);
  const customer = useAuthStore((s) => s.customer);
  const logout = useAuthStore((s) => s.logout);
  const cartItems = useCartStore((s) => s.items);
  const wishlistItems = useWishlistStore((s) => s.items);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  useEffect(() => {
    const id = setTimeout(async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await customerApi.products({ q: query.trim(), limit: 6, page: 1 });
        setSuggestions(res.items);
      } catch {
        setSuggestions([]);
      }
    }, 250);
    return () => clearTimeout(id);
  }, [query]);

  function onSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    setMobileOpen(false);
    setSuggestions([]);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[var(--color-secondary)]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[1440px] flex-wrap items-center gap-3 px-3 py-3 sm:px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <span className="rounded-lg bg-[var(--color-accent)] px-2 py-1 text-sm font-bold text-[var(--color-primary)]">S</span>
          <span className="text-lg font-bold tracking-tight">ShopSphere</span>
        </Link>

        <form className="relative order-3 w-full md:order-none md:flex-1" onSubmit={onSearchSubmit}>
          <div className="flex overflow-hidden rounded-xl bg-white">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 flex-1 px-3 text-sm outline-none"
              placeholder="Search for mobiles, laptops, beauty..."
            />
            <button className="bg-[var(--color-accent)] px-4 text-sm font-semibold text-[var(--color-primary)]">
              Search
            </button>
          </div>
          {suggestions.length > 0 ? (
            <div className="absolute left-0 right-0 top-12 rounded-xl border border-slate-100 bg-white p-2 shadow-xl">
              {suggestions.map((item) => (
                <button
                  key={item.pid}
                  className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-slate-100"
                  onClick={() => {
                    router.push(`/product/${item.pid}`);
                    setQuery("");
                    setSuggestions([]);
                  }}
                  type="button"
                >
                  {item.pname}
                </button>
              ))}
            </div>
          ) : null}
        </form>

        <button
          type="button"
          className="rounded-lg border border-white/30 px-2 py-1 text-xs text-white md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className={`${mobileOpen ? "flex" : "hidden"} w-full flex-col gap-2 md:flex md:w-auto md:flex-row md:items-center md:gap-4`}>
          {links.map((link) => {
            const active = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-lg px-2 py-1 text-sm ${active ? "bg-white/15 text-white" : "text-slate-200 hover:text-white"}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link href="/cart" className="rounded-lg bg-white px-2 py-1 text-sm font-semibold text-slate-700">
            Cart ({cartCount})
          </Link>
          <Link href="/wishlist" className="rounded-lg bg-white px-2 py-1 text-sm font-semibold text-slate-700">
            Wish ({wishlistItems.length})
          </Link>
          <ThemeToggle />
          {token ? (
            <>
              <Link href="/profile" className="text-sm text-slate-100 hover:text-white">
                Hi, {customer?.name || "User"}
              </Link>
              <button
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm text-slate-100 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="rounded-lg bg-[var(--color-accent)] px-3 py-2 text-xs font-semibold text-[var(--color-primary)]">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
