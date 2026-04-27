"use client";

import Link from "next/link";
import CartItem from "@/components/CartItem";
import CheckoutSummary from "@/components/CheckoutSummary";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";

export default function CartPage() {
  const token = useAuthStore((s) => s.token);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const updateQty = useCartStore((s) => s.updateQty);
  const removeItem = useCartStore((s) => s.removeItem);
  const toast = useToastStore((s) => s.push);

  return (
    <div className="space-y-5 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        {items.length ? (
          <Button
            variant="outline"
            onClick={async () => {
              await clear(token);
              toast({ title: "Cart cleared", tone: "info" });
            }}
          >
            Clear Cart
          </Button>
        ) : null}
      </div>

      {!items.length ? (
        <div className="surface-card p-8 text-center">
          <p className="text-sm text-slate-500">Your cart is empty.</p>
          <Link href="/products" className="mt-3 inline-block text-sm font-semibold text-(--color-secondary)">
            Continue shopping
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {items.map((item) => (
              <CartItem
                key={item.pid}
                item={item}
                onUpdateQty={(pid, qty) => updateQty(pid, qty, token)}
                onRemove={(pid) => removeItem(pid, token)}
              />
            ))}
          </div>
          <div className="space-y-3">
            <CheckoutSummary items={items} />
            <Link href="/checkout" className="block">
              <Button className="w-full" size="lg">
                Proceed to Buy
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

