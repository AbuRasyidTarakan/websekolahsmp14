import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingGuruStaff() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-72" />
      <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border p-4 text-center">
            <Skeleton className="mx-auto h-24 w-24 rounded-full" />
            <Skeleton className="mx-auto mt-3 h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
