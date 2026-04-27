import { Skeleton } from "@/components/ui/skeleton";

export default function ProductSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-3">
      <Skeleton className="aspect-[4/3] w-full" />
      <Skeleton className="mt-3 h-4 w-1/2" />
      <Skeleton className="mt-2 h-4 w-4/5" />
      <Skeleton className="mt-4 h-10 w-full" />
    </div>
  );
}
