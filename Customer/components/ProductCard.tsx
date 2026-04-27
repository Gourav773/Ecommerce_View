"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calcDiscountedPrice, discountPercent, formatMoney } from "@/lib/format";
import { resolveImageUrl } from "@/lib/image";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";
import { useWishlistStore } from "@/store/wishlist-store";
import type { ProductListItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({
  item,
  onQuickView,
}: {
  item: ProductListItem;
  onQuickView?: (item: ProductListItem) => void;
}) {
  const token = useAuthStore((s) => s.token);
  const addToCart = useCartStore((s) => s.addItem);
  const toggleWishlist = useWishlistStore((s) => s.toggleWishlist);
  const pushToast = useToastStore((s) => s.push);
  const router = useRouter();

  const imageUrl = resolveImageUrl(item.image);
  const discounted = calcDiscountedPrice(item.price, item.discount);
  const percent = discountPercent(item.price, item.discount);

  async function handleCart() {
    try {
      await addToCart(item, token);
      pushToast({ title: "Added to cart", tone: "success" });
    } catch (error) {
      pushToast({
        title: "Failed to add cart item",
        description: error instanceof Error ? error.message : undefined,
        tone: "error",
      });
    }
  }

  async function handleWishlist() {
    try {
      const next = await toggleWishlist(item, token);
      pushToast({
        title: next ? "Added to wishlist" : "Removed from wishlist",
        tone: "info",
      });
    } catch {
      if (!token) router.push(`/login?next=${encodeURIComponent(`/product/${item.pid}`)}`);
    }
  }

  return (
    <article className="group h-full overflow-hidden rounded-2xl border border-slate-100 bg-white p-3 shadow-md transition hover:-translate-y-1 hover:shadow-xl">
      <div className="relative mb-3 aspect-[4/3] overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={imageUrl}
          alt={item.pname}
          fill
          sizes="(max-width: 768px) 100vw, 25vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {percent > 0 ? (
          <Badge className="absolute left-2 top-2 bg-[var(--color-success)] text-white">
            {percent}% OFF
          </Badge>
        ) : null}
      </div>

      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {item.brand_name || item.Categoryname || "Popular"}
        </span>
        <span className="text-xs font-semibold text-[var(--color-accent)]">4.5★</span>
      </div>

      <Link href={`/product/${item.pid}`} className="line-clamp-2 text-sm font-semibold leading-5 text-slate-800 hover:text-[var(--color-secondary)]">
        {item.pname}
      </Link>

      <div className="mt-3 flex items-end gap-2">
        <span className="text-lg font-bold text-[var(--color-text)]">{formatMoney(discounted)}</span>
        {Number(item.discount || 0) > 0 ? (
          <span className="text-xs text-slate-500 line-through">{formatMoney(item.price)}</span>
        ) : null}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <Button size="sm" onClick={handleCart}>
          Add Cart
        </Button>
        <Button size="sm" variant="outline" onClick={handleWishlist}>
          Wishlist
        </Button>
      </div>

      {onQuickView ? (
        <Button size="sm" variant="ghost" className="mt-2 w-full" onClick={() => onQuickView(item)}>
          Quick View
        </Button>
      ) : null}
    </article>
  );
}
