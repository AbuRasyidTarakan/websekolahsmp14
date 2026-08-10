import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAgenda() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="mt-6 h-6 w-32" />
      <div className="mt-3 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex gap-4 rounded-lg border border-border p-4">
            <Skeleton className="h-14 w-14 shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
