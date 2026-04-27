import axios from "axios";
import type {
  CartApiItem,
  Category,
  Customer,
  OrderItem,
  ProductDetailsResponse,
  ProductListResponse,
  Subcategory,
  WishlistItem,
} from "@/types";

export const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000").replace(/\/+$/, "");

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("customerToken");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (!token) localStorage.removeItem("customerToken");
  else localStorage.setItem("customerToken", token);
}

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const customerApi = {
  categories: async () => (await api.get<Category[]>("/api/customer/categories")).data,
  subcategories: async (categoryId?: string) =>
    (
      await api.get<Subcategory[]>("/api/customer/subcategories", {
        params: { categoryId },
      })
    ).data,
  products: async (params: Record<string, string | number | undefined>) =>
    (await api.get<ProductListResponse>("/api/customer/products", { params })).data,
  product: async (pid: string) =>
    (await api.get<ProductDetailsResponse>(`/api/customer/products/${encodeURIComponent(pid)}`)).data,
  login: async (payload: { email?: string; mobile?: string; password: string }) =>
    (await api.post<{ token: string; customer: Customer }>("/api/customer/auth/login", payload)).data,
  register: async (payload: { name: string; email: string; mobile: string; password: string }) =>
    (await api.post<{ token: string; customer: Customer }>("/api/customer/auth/register", payload)).data,
  me: async () => (await api.get<Customer>("/api/customer/auth/me")).data,
  otpRequest: async (payload: { mobile: string; purpose: "login" | "reset" }) =>
    (await api.post<{ otp?: string }>("/api/customer/auth/otp/request", payload)).data,
  otpVerify: async (payload: { mobile: string; otp: string; purpose: "login" | "reset"; newPassword?: string }) =>
    (await api.post<{ token?: string; message: string }>("/api/customer/auth/otp/verify", payload)).data,
  cartList: async () => (await api.get<CartApiItem[]>("/api/customer/cart")).data,
  cartAdd: async (pid: string, quantity: number) => api.post("/api/customer/cart", { pid, quantity }),
  cartUpdate: async (pid: string, quantity: number) => api.put(`/api/customer/cart/${encodeURIComponent(pid)}`, { quantity }),
  cartRemove: async (pid: string) => api.delete(`/api/customer/cart/${encodeURIComponent(pid)}`),
  cartClear: async () => api.delete("/api/customer/cart"),
  wishlistList: async () => (await api.get<WishlistItem[]>("/api/customer/wishlist")).data,
  wishlistAdd: async (pid: string) => api.post("/api/customer/wishlist", { pid }),
  wishlistRemove: async (pid: string) => api.delete(`/api/customer/wishlist/${encodeURIComponent(pid)}`),
  orders: async () => (await api.get<OrderItem[]>("/api/customer/orders")).data,
  placeOrder: async (payload: {
    payment_method: "cod" | "online";
    payment_verified?: boolean;
    payment_reference?: string;
    address: {
      name: string;
      mobile: string;
      address_line: string;
      city: string;
      state: string;
      country: string;
      pin: string;
    };
  }) => (await api.post<{ orderid: string }>("/api/customer/orders/place", payload)).data,
  createRazorpayOrder: async (payload: { amount: number; currency: string; receipt: string }) =>
    (await api.post<{ key: string; orderId: string; amount: number; currency: string }>("/api/customer/payments/create-order", payload)).data,
  verifyRazorpayOrder: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => (await api.post<{ verified: boolean }>("/api/customer/payments/verify", payload)).data,
};
