import { Skeleton } from "@/components/ui/skeleton";
import { TextSkeleton } from "./primitives";

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="rounded-lg border p-4 space-y-3">
      <TextSkeleton w={120} h={18} />

      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" />
      ))}
    </div>
  );
}
