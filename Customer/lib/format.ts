export function formatMoney(value: unknown) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "₹0";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function calcDiscountedPrice(price: unknown, discount: unknown) {
  const p = Number(price);
  const d = Number(discount);
  if (!Number.isFinite(p)) return 0;
  if (!Number.isFinite(d)) return p;
  return Math.max(0, p - d);
}

export function discountPercent(price: unknown, discount: unknown) {
  const p = Number(price);
  const d = Number(discount);
  if (!Number.isFinite(p) || p <= 0 || !Number.isFinite(d) || d <= 0) return 0;
  return Math.round((d / p) * 100);
}

export function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}
