import { Skeleton } from "@/components/ui/skeleton";

export function TextSkeleton({ w = 100, h = 16 }: { w?: number; h?: number }) {
  return <Skeleton style={{ width: w, height: h }} />;
}

export function AvatarSkeleton() {
  return <Skeleton className="h-9 w-9 rounded-full" />;
}

export function BadgeSkeleton({ w = 60 }: { w?: number }) {
  return <Skeleton className="h-6 rounded-full" style={{ width: w }} />;
}

export function InputSkeleton({ w = 200 }: { w?: number }) {
  return <Skeleton className="h-9 rounded-md" />;
}

export function ButtonSkeleton({ w = 100 }: { w?: number }) {
  return <Skeleton className="h-10 rounded-md" style={{ width: w }} />;
}
