import { cn } from "@/lib/utils";
import { StateCard } from "./state-card";

interface LoadingStateProps {
  title?: string;
  description?: string;
  searchText?: string;
  className?: string;
}

export function LoadingState({
  title = "Loading...",
  description = "We're getting things ready.",
  searchText,
  className,
}: LoadingStateProps) {
  return (
    <StateCard
      title={searchText ? "Searching..." : title}
      description={searchText ? `Looking for "${searchText}"` : description}
      className={cn("animate-pulse", className)}
    />
  );
}
