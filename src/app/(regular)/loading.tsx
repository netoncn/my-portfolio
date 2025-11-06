import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4">
      <section className="min-h-[90vh] flex items-center justify-center py-20">
        <div className="max-w-7xl w-full flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="flex-1 space-y-6 order-2 md:order-1">
            <div className="space-y-4 mb-12">
              <Skeleton className="h-16 w-96 max-w-full" />
              <Skeleton className="h-8 w-72 max-w-full" />
            </div>
            <Skeleton className="h-24 w-full" />
          </div>

          <div className="w-full md:w-auto flex flex-col items-center gap-8 order-1 md:order-2">
            <Skeleton className="aspect-square w-full max-w-[300px] rounded-full" />
            <div className="flex gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Skeleton className="h-10 w-full sm:w-40" />
              <Skeleton className="h-10 w-full sm:w-40" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="space-y-12">
          <div className="space-y-4">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-6 w-96 max-w-full" />
          </div>

          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-24" />
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-lg border overflow-hidden">
                <Skeleton className="aspect-video w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
