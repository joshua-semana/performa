import { cn } from "@/lib/utils";
import { AvatarSkeleton, BadgeSkeleton, TextSkeleton } from "./primitives";

export function TableSkeleton({
  rows = 6,
  cols = 5,
  withAvatar = true,
}: {
  rows?: number;
  cols?: number;
  withAvatar?: boolean;
}) {
  return (
    <div className="rounded-lg border animate-pulse overflow-hidden">
      {/* header */}
      <div
        className="grid gap-4 px-4 py-3 border-b"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: cols }).map((_, i) => (
          <TextSkeleton key={i} w={60} />
        ))}
      </div>

      {/* rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "grid gap-4 px-4 border-b items-center",
            withAvatar ? "py-2" : "py-4",
          )}
          style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
        >
          {Array.from({ length: cols }).map((_, j) => (
            <div key={j} className="flex items-center gap-3">
              {j === 0 && withAvatar && <AvatarSkeleton />}
              <TextSkeleton w={90} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
