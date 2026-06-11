import { Inbox, LucideIcon, SearchX } from "lucide-react";
import { StateCard } from "./state-card";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  searchText?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  icon = Inbox,
  title = "Nothing here yet",
  description = "Content will appear here once it's available.",
  searchText,
  actions,
  className,
}: EmptyStateProps) {
  return (
    <StateCard
      icon={searchText ? SearchX : icon}
      title={searchText ? "No results found" : title}
      description={
        searchText
          ? `We couldn't find anything matching "${searchText}"`
          : description
      }
      className={cn("", className)}
      actions={actions}
    />
  );
}
