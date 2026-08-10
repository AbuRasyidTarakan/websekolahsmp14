import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingBerita() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-4 h-10 w-72" />
      <div className="mt-4 flex gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-full" />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="aspect-[16/9] w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
