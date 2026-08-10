import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingFaq() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
