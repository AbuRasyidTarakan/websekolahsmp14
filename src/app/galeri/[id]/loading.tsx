import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDetailGaleri() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="mt-2 h-8 w-64" />
      <Skeleton className="mt-2 h-4 w-40" />
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square w-full" />
        ))}
      </div>
    </div>
  );
}
