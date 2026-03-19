import { InputSkeleton } from "./primitives";

export function FiltersSkeleton() {
  return (
    <div className="flex flex-wrap gap-3">
      <InputSkeleton w={260} />
      <InputSkeleton w={140} />
      <InputSkeleton w={140} />
      <InputSkeleton w={140} />
    </div>
  );
}
