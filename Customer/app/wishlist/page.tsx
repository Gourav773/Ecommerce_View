"use client";

import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductListItem } from "@/types";

export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <div className="space-y-4 fade-in">
      <h1 className="text-2xl font-bold">My Wishlist</h1>
      {!items.length ? (
        <div className="surface-card p-8 text-center">
          <p className="text-sm text-slate-500">No wishlist items yet.</p>
          <Link href="/products" className="mt-2 inline-block text-sm font-semibold text-(--color-secondary)">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <ProductCard
              key={item.pid}
              item={{
                pid: item.pid,
                pname: item.pname || item.pid,
                price: item.price || 0,
                discount: item.discount || 0,
                image: item.image,
              } as ProductListItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}

