import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

interface StateCardProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export function StateCard({
  icon: Icon,
  title,
  description,
  actions,
  children,
  className,
}: StateCardProps) {
  return (
    <Card className={cn("shadow-sm backdrop-blur-sm w-full h-full", className)}>
      <CardContent className="flex flex-1 flex-col py-4 px-8 items-center justify-center text-center gap-1">
        {Icon && (
          <div className="flex items-center justify-center p-2.5 bg-secondary rounded-sm mb-2 border border-border/60">
            <Icon className="size-5 text-muted-foreground" />
          </div>
        )}

        <h1 className="text-base font-semibold tracking-tight">{title}</h1>

        {description && (
          <p className="text-muted-foreground max-w-md leading-6 text-pretty">
            {description}
          </p>
        )}

        {children}

        {actions && (
          <div className="flex flex-col gap-3 sm:flex-row mt-4">{actions}</div>
        )}
      </CardContent>
    </Card>
  );
}
