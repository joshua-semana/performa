import { FilterConfig } from "@/lib/types/filter";
import { Button } from "./button";
import { X } from "lucide-react";
import { Badge } from "./badge";

interface DataTableFilterChipsProps {
  filters: FilterConfig[];
}
export function DataTableFilterChips({ filters }: DataTableFilterChipsProps) {
  const activeFilters = filters.filter((filter) => filter.value);

  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {activeFilters.map((filter) => {
        const selected = filter.options.find(
          (option) => option.value === filter.value,
        );

        return (
          <Badge key={filter.key} variant="secondary" asChild>
            <Button
              onClick={() => filter.onChange(undefined)}
              variant={"secondary"}
              className="cursor-pointer"
            >
              <span className="text-muted-foreground">{filter.label}:</span>

              <span>{selected?.label}</span>

              <X className="size-3" />
            </Button>
          </Badge>
        );
      })}
    </div>
  );
}
