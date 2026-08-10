import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBeranda() {
  return (
    <div>
      <Skeleton className="h-[280px] w-full rounded-none sm:h-[380px] lg:h-[480px]" />

      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-24 shrink-0 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <Skeleton className="h-8 w-48" />
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-lg border border-border">
              <Skeleton className="aspect-[16/9] w-full rounded-none" />
              <div className="space-y-2 p-4">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
