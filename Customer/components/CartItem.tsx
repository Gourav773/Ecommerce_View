"use client";

import Image from "next/image";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/image";
import { calcDiscountedPrice, formatMoney } from "@/lib/format";
import type { CartItem as CartItemType } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  item: CartItemType;
  onUpdateQty: (pid: string, qty: number) => void;
  onRemove: (pid: string) => void;
};

export default function CartItem({ item, onUpdateQty, onRemove }: Props) {
  const unit = calcDiscountedPrice(item.price, item.discount);
  return (
    <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-100 bg-white p-3 shadow-sm md:grid-cols-[110px_1fr_110px_130px_70px] md:items-center">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-slate-100">
        <Image
          src={resolveImageUrl(item.image)}
          alt={item.pname || item.pid}
          fill
          className="object-cover"
          sizes="110px"
        />
      </div>
      <div>
        <Link href={`/product/${item.pid}`} className="line-clamp-2 text-sm font-semibold text-slate-800 hover:underline">
          {item.pname || item.pid}
        </Link>
        <div className="mt-1 text-xs text-slate-500">PID: {item.pid}</div>
      </div>
      <div className="text-sm font-semibold">{formatMoney(unit)}</div>
      <Input
        type="number"
        min={1}
        value={item.quantity}
        onChange={(e) => onUpdateQty(item.pid, Number(e.target.value || 1))}
      />
      <Button variant="ghost" size="sm" onClick={() => onRemove(item.pid)}>
        Remove
      </Button>
    </div>
  );
}

