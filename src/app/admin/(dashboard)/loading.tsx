import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingAdmin() {
  return (
    <div className="max-w-3xl">
      <Skeleton className="h-8 w-48" />
      <div className="mt-6 space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </div>
  );
}
