import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingVideo() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-lg border border-border">
            <Skeleton className="aspect-video w-full rounded-none" />
            <div className="space-y-2 p-4">
              <Skeleton className="h-5 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
