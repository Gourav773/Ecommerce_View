"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function OrderSuccessClient() {
  const searchParams = useSearchParams();
  const orderid = searchParams.get("orderid");

  return (
    <div className="mx-auto max-w-xl fade-in">
      <div className="surface-card p-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-700">
          ✓
        </div>
        <h1 className="text-2xl font-bold">Order Placed Successfully</h1>
        <p className="mt-2 text-sm text-slate-500">
          {orderid ? `Your order ID is ${orderid}.` : "Your order has been confirmed."}
        </p>
        <div className="mt-5 flex justify-center gap-3">
          <Link href="/orders">
            <Button variant="outline">View Orders</Button>
          </Link>
          <Link href="/products">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
