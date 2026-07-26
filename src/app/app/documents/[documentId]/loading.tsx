import Skeleton from "@/components/ui/Skeleton";

export default function DocumentLoading() {
  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      <div>
        <Skeleton className="h-4 w-72 mb-1" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-96" />
          <div className="flex gap-3">
            <Skeleton className="h-8 w-16 rounded-lg" />
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
        </div>
      </div>
      <Skeleton className="h-96 rounded-lg" />
      <div className="flex gap-4">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  );
}
