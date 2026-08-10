import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingUnduhan() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg border border-border p-4">
            <Skeleton className="h-8 w-8" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
