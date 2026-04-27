"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import CheckoutSummary from "@/components/CheckoutSummary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { customerApi } from "@/lib/api";
import { getApiErrorMessage } from "@/lib/errors";
import { loadRazorpayScript, openRazorpay } from "@/lib/razorpay";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";
import { useToastStore } from "@/store/toast-store";

export default function CheckoutPage() {
  const router = useRouter();
  const token = useAuthStore((s) => s.token);
  const customer = useAuthStore((s) => s.customer);
  const items = useCartStore((s) => s.items);
  const clear = useCartStore((s) => s.clear);
  const toast = useToastStore((s) => s.push);

  const [name, setName] = useState(customer?.name || "");
  const [mobile, setMobile] = useState(customer?.mobile || "");
  const [addressLine, setAddressLine] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pin, setPin] = useState("");
  const [country, setCountry] = useState("India");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("online");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(
    () => items.reduce((sum, item) => sum + Math.max(0, Number(item.price || 0) - Number(item.discount || 0)) * item.quantity, 0),
    [items]
  );

  async function placeOrderAndRedirect(
    payment_method: "cod" | "online",
    paymentVerified = false,
    paymentReference?: string
  ) {
    const res = await customerApi.placeOrder({
      payment_method,
      payment_verified: paymentVerified,
      payment_reference: paymentReference,
      address: {
        name,
        mobile,
        address_line: addressLine,
        city,
        state,
        pin,
        country,
      },
    });
    await clear(token);
    router.push(`/order-success?orderid=${encodeURIComponent(res.orderid)}`);
  }

  async function handleCheckout(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (!token) {
        router.push("/login?next=/checkout");
        return;
      }
      if (paymentMethod === "cod") {
        await placeOrderAndRedirect("cod");
        return;
      }

      const sdkReady = await loadRazorpayScript();
      if (!sdkReady) throw new Error("Razorpay SDK failed to load");

      try {
        const order = await customerApi.createRazorpayOrder({
          amount: Math.round(total * 100),
          currency: "INR",
          receipt: `rcpt_${Date.now()}`,
        });

        openRazorpay({
          key: order.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: order.amount,
          currency: order.currency,
          name: "ShopSphere",
          description: "Order Payment",
          order_id: order.orderId,
          prefill: {
            name,
            contact: mobile,
            email: customer?.email,
          },
          theme: { color: "#FF9900" },
          handler: async (response) => {
            try {
              await customerApi.verifyRazorpayOrder(response);
              await placeOrderAndRedirect("online", true, response.razorpay_payment_id);
            } catch {
              setError("Payment verification failed.");
            }
          },
        });
      } catch {
        await placeOrderAndRedirect("online", false);
        toast({
          title: "Order placed with pending online payment",
          description: "Configure Razorpay keys and backend payment endpoints to mark online payments as paid after verification.",
          tone: "info",
        });
      }
    } catch (e) {
      setError(getApiErrorMessage(e, "Checkout failed"));
    } finally {
      setLoading(false);
    }
  }

  if (!items.length) {
    return (
      <div className="surface-card p-8 text-center">
        <h1 className="text-xl font-bold">Checkout</h1>
        <p className="mt-2 text-sm text-slate-500">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 fade-in lg:grid-cols-[1fr_360px]">
      <form className="surface-card space-y-4 p-5" onSubmit={handleCheckout}>
        <div>
          <h1 className="text-2xl font-bold">Checkout</h1>
          <p className="text-sm text-slate-500">Fill delivery details and complete payment.</p>
        </div>

        {error ? <div className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</div> : null}

        <div className="grid gap-3 md:grid-cols-2">
          <Input placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input placeholder="Mobile Number" value={mobile} onChange={(e) => setMobile(e.target.value)} required />
          <div className="md:col-span-2">
            <Input placeholder="Address Line" value={addressLine} onChange={(e) => setAddressLine(e.target.value)} required />
          </div>
          <Input placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} required />
          <Input placeholder="State" value={state} onChange={(e) => setState(e.target.value)} required />
          <Input placeholder="PIN Code" value={pin} onChange={(e) => setPin(e.target.value)} required />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} required />
        </div>

        <div>
          <label className="mb-1 block text-sm font-semibold">Payment Method</label>
          <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value === "cod" ? "cod" : "online")}>
            <option value="online">Razorpay (UPI/Card/Netbanking)</option>
            <option value="cod">Cash on Delivery</option>
          </Select>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? "Processing..." : "Proceed to Pay"}
        </Button>
      </form>

      <CheckoutSummary items={items} />
    </div>
  );
}
