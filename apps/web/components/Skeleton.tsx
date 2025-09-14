export function SkeletonCard({ rows = 2 }: { rows?: number }) {
  return (
    <div className="rounded-md border p-4 animate-pulse">
      <div className="h-4 w-40 bg-neutral-200 dark:bg-neutral-800 rounded mb-2" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-3 w-full bg-neutral-200 dark:bg-neutral-800 rounded mb-1" />
      ))}
    </div>
  );
}

export function SkeletonList({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

