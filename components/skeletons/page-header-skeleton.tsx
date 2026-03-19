import { ButtonSkeleton, TextSkeleton } from "./primitives";

export function PageHeaderSkeleton() {
  return (
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <TextSkeleton w={140} h={32} />
        <TextSkeleton w={260} h={14} />
      </div>

      <ButtonSkeleton w={120} />
    </div>
  );
}
