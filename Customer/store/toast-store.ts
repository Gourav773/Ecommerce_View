"use client";

import { create } from "zustand";

export type ToastTone = "success" | "error" | "info";

type ToastItem = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
};

type ToastState = {
  items: ToastItem[];
  push: (toast: Omit<ToastItem, "id">) => void;
  remove: (id: number) => void;
};

let id = 1;

export const useToastStore = create<ToastState>((set) => ({
  items: [],
  push: (toast) =>
    set((state) => ({
      items: [...state.items, { ...toast, id: id++ }],
    })),
  remove: (toastId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== toastId),
    })),
}));

