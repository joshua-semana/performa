import {
  AlertCircle,
  ArrowLeft,
  ListRestart,
  LucideIcon,
  RefreshCcw,
  RefreshCw,
} from "lucide-react";
import { StateCard } from "./state-card";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  icon?: LucideIcon;
  title?: string;
  description?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  showBack?: boolean;
  onBack?: () => void;
  className?: string;
}

export function ErrorState({
  icon = AlertCircle,
  title = "Something went wrong",
  description = "We’re having trouble loading the data right now.",
  showRetry,
  onRetry,
  showBack,
  onBack,
  className,
}: ErrorStateProps) {
  return (
    <StateCard
      className={cn("w-fit", className)}
      icon={icon}
      title={title}
      description={description}
      actions={
        <div className="flex gap-2">
          {showBack && (
            <Button
              variant="secondary"
              className="cursor-pointer"
              size={"sm"}
              onClick={onBack}
            >
              <ArrowLeft className="size-4 shirnk-0" />
              Back
            </Button>
          )}
          {showRetry && (
            <Button size={"sm"} className="cursor-pointer" onClick={onRetry}>
              <RefreshCw className="size-4 shirnk-0" />
              Retry
            </Button>
          )}
        </div>
      }
    />
  );
}
