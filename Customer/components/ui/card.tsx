import { cn } from "@/lib/utils";

export function Card({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "surface-card rounded-2xl border border-slate-100 bg-[var(--color-card)]",
        className
      )}
      {...props}
    />
  );
}

