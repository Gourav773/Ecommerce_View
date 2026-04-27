export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
};

export async function loadRazorpayScript() {
  if (typeof window === "undefined") return false;
  if ((window as Window & { Razorpay?: unknown }).Razorpay) return true;

  return new Promise<boolean>((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function openRazorpay(options: RazorpayOptions) {
  const RazorpayRef = (window as Window & { Razorpay?: new (opts: RazorpayOptions) => { open: () => void } }).Razorpay;
  if (!RazorpayRef) throw new Error("Razorpay SDK not loaded");
  const instance = new RazorpayRef(options);
  instance.open();
}

