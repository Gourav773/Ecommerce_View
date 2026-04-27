"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { customerApi, setToken } from "@/lib/api";
import type { Customer } from "@/types";

type AuthState = {
  token: string | null;
  customer: Customer | null;
  hydrated: boolean;
  setHydrated: (value: boolean) => void;
  login: (identifier: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; mobile: string; password: string }) => Promise<void>;
  requestOtp: (mobile: string, purpose: "login" | "reset") => Promise<{ otp?: string }>;
  loginWithOtp: (mobile: string, otp: string) => Promise<void>;
  resetPasswordWithOtp: (mobile: string, otp: string, newPassword: string) => Promise<void>;
  fetchMe: () => Promise<void>;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      customer: null,
      hydrated: false,
      setHydrated: (value) => set({ hydrated: value }),
      login: async (identifier, password) => {
        const payload = identifier.includes("@")
          ? { email: identifier.trim(), password }
          : { mobile: identifier.trim(), password };
        const res = await customerApi.login(payload);
        setToken(res.token);
        set({ token: res.token, customer: res.customer });
      },
      register: async (payload) => {
        const res = await customerApi.register(payload);
        setToken(res.token);
        set({ token: res.token, customer: res.customer });
      },
      requestOtp: (mobile, purpose) => customerApi.otpRequest({ mobile, purpose }),
      loginWithOtp: async (mobile, otp) => {
        const res = await customerApi.otpVerify({ mobile, otp, purpose: "login" });
        if (!res.token) throw new Error("No token returned");
        setToken(res.token);
        set({ token: res.token });
        await get().fetchMe();
      },
      resetPasswordWithOtp: (mobile, otp, newPassword) =>
        customerApi.otpVerify({ mobile, otp, purpose: "reset", newPassword }).then(() => undefined),
      fetchMe: async () => {
        if (!get().token) return;
        try {
          const me = await customerApi.me();
          set({ customer: me });
        } catch {
          setToken(null);
          set({ token: null, customer: null });
        }
      },
      logout: () => {
        setToken(null);
        set({ token: null, customer: null });
      },
    }),
    {
      name: "customer-auth",
      partialize: (state) => ({ token: state.token, customer: state.customer }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);

