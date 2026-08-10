import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingDetailBerita() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <Skeleton className="h-4 w-40" />
      <Skeleton className="mt-4 h-6 w-24 rounded-full" />
      <Skeleton className="mt-3 h-9 w-full" />
      <Skeleton className="mt-2 h-9 w-2/3" />
      <Skeleton className="mt-3 h-4 w-56" />
      <Skeleton className="mt-6 aspect-[16/9] w-full" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}
