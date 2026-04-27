"use client";

import { useEffect, useState } from "react";
import { customerApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/errors";
import { formatDate, formatMoney } from "@/lib/format";
import type { OrderItem } from "@/types";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load(showLoader = true) {
    if (showLoader) setLoading(true);
    setError(null);
    try {
      const rows = await customerApi.orders();
      setOrders(rows);
    } catch (e) {
      setError(getApiErrorMessage(e, "Failed to load orders"));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load(false);
  }, []);

  return (
    <div className="space-y-4 fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My Orders</h1>
        <Button variant="outline" onClick={() => load()}>Refresh</Button>
      </div>
      {error ? <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
      {loading ? (
        <div className="surface-card p-4 text-sm text-slate-500">Loading orders...</div>
      ) : orders.length === 0 ? (
        <div className="surface-card p-8 text-center text-sm text-slate-500">No orders yet.</div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-100 bg-white shadow-sm">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Product</th>
                <th className="px-4 py-3">Qty</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={`${order.orderid}-${index}`} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{order.orderid}</td>
                  <td className="px-4 py-3">{order.pname || order.pid || "-"}</td>
                  <td className="px-4 py-3">{order.quantity || "-"}</td>
                  <td className="px-4 py-3">{formatMoney(order.total_price || 0)}</td>
                  <td className="px-4 py-3">{order.payment_method || "-"} ({order.payment_status || "-"})</td>
                  <td className="px-4 py-3">{order.status || "-"}</td>
                  <td className="px-4 py-3">{formatDate(order.order_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
