import { calcDiscountedPrice, formatMoney } from "@/lib/format";
import type { CartItem } from "@/types";
import { Card } from "@/components/ui/card";

export default function CheckoutSummary({ items }: { items: CartItem[] }) {
  const subtotal = items.reduce(
    (sum, item) => sum + calcDiscountedPrice(item.price, item.discount) * item.quantity,
    0
  );
  const discount = items.reduce(
    (sum, item) =>
      sum + Math.max(0, Number(item.discount || 0)) * item.quantity,
    0
  );
  const total = Math.max(0, subtotal);

  return (
    <Card className="p-5">
      <h3 className="mb-4 text-base font-bold">Order Summary</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Subtotal</span>
          <span className="font-semibold">{formatMoney(subtotal + discount)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Discount</span>
          <span className="font-semibold text-[var(--color-success)]">- {formatMoney(discount)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-3">
          <span className="text-slate-700">Total</span>
          <span className="text-lg font-bold">{formatMoney(total)}</span>
        </div>
      </div>
    </Card>
  );
}

