export default function CarCardSkeleton() {
  return (
    <div className="bg-kairo-surface border border-kairo-border rounded-lg overflow-hidden animate-pulse">
      <div className="h-64 bg-kairo-panel" />
      <div className="p-6 space-y-3">
        <div className="h-6 bg-kairo-panel rounded w-3/4" />
        <div className="h-4 bg-kairo-panel rounded w-1/2" />
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-kairo-border">
          <div className="h-10 bg-kairo-panel rounded" />
          <div className="h-10 bg-kairo-panel rounded" />
          <div className="h-10 bg-kairo-panel rounded" />
        </div>
      </div>
    </div>
  );
}
