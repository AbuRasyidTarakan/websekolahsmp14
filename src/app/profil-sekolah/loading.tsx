import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingProfilSekolah() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="flex items-center gap-4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-8 w-64" />
      </div>
      <div className="mt-8 space-y-3">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
