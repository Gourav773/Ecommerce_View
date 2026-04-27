import { API_BASE } from "./api";

export function resolveImageUrl(image: unknown): string {
  const raw = String(image || "").trim();
  if (!raw) return "/next.svg";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  if (raw.startsWith("/")) return `${API_BASE}${raw}`;
  return `${API_BASE}/${raw}`;
}
