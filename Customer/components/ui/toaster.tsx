"use client";

import { useEffect } from "react";
import { useToastStore } from "@/store/toast-store";

export function Toaster() {
  const items = useToastStore((s) => s.items);
  const remove = useToastStore((s) => s.remove);

  useEffect(() => {
    if (!items.length) return;
    const timers = items.map((item) =>
      setTimeout(() => remove(item.id), 2500)
    );
    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [items, remove]);

  return (
    <div className="pointer-events-none fixed right-3 top-3 z-[60] flex w-[min(92vw,380px)] flex-col gap-2">
      {items.map((item) => (
        <div
          key={item.id}
          className={`pointer-events-auto rounded-xl px-4 py-3 text-sm shadow-lg fade-in ${
            item.tone === "error"
              ? "bg-red-50 text-red-700"
              : item.tone === "success"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-700"
          }`}
        >
          <div className="font-semibold">{item.title}</div>
          {item.description ? <div>{item.description}</div> : null}
        </div>
      ))}
    </div>
  );
}

