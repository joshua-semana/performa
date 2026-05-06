import { AlertCircle, ArrowLeft, LucideIcon, RefreshCw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  Icon?: LucideIcon;
  title?: string;
  description?: string;
  backLabel?: string;
  retryLabel?: string;
  showRetry?: boolean;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
};

export default function ErrorState({
  Icon = AlertCircle,
  title = "Something went wrong",
  description = "We couldn’t load the requested information. It may no longer be available or the link may be invalid.",
  backLabel = "Go Back",
  retryLabel = "Try Again",
  showRetry = false,
  onRetry,
  onBack,
  className = "",
}: ErrorStateProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) return onBack();
    router.back();
  };

  return (
    <div className={cn("flex items-center justify-center mb-8", className)}>
      <Card className="shadow-sm backdrop-blur-sm">
        <CardContent className="flex flex-col items-center text-center gap-2">
          <div className="flex items-center justify-center p-2.5 bg-secondary rounded-sm mb-2 border border-border/60">
            <Icon className="size-5 text-muted-foreground" />
          </div>
          <h1 className="text-base font-semibold tracking-tight">{title}</h1>
          <h2 className="text-muted-foreground mb-3 max-w-md leading-6 text-pretty">
            {description}
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" size={"sm"} onClick={handleBack}>
              <ArrowLeft className="size-4" />
              {backLabel}
            </Button>

            {showRetry && (
              <Button onClick={onRetry} size={"sm"}>
                <RefreshCw className="size-4" />
                {retryLabel}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
