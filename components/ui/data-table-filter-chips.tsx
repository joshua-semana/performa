import { FilterConfig } from "@/lib/types/filter";
import { Button } from "./button";
import { X } from "lucide-react";
import { Badge } from "./badge";

interface DataTableFilterChipsProps {
  filters: FilterConfig[];
}
export function DataTableFilterChips({ filters }: DataTableFilterChipsProps) {
  const activeFilters = filters.filter((filter) => filter.value);

  const clearAll = () => {
    activeFilters.forEach((filter) => filter.onChange(undefined));
  };

  if (!activeFilters.length) return null;

  return (
    <div className="flex flex-wrap gap-1 items-center">
      {activeFilters.map((filter) => {
        const selected = filter.options.find(
          (option) => option.value === filter.value,
        );

        return (
          <Button
            key={filter.key}
            variant="secondary"
            size="sm"
            className="gap-2 rounded-full cursor-pointer"
            onClick={() => filter.onChange(undefined)}
          >
            <span className="text-muted-foreground">{filter.label}:</span>

            <span>{selected?.label}</span>

            <X className="size-3" />
          </Button>
        );
      })}

      {activeFilters.length > 1 && (
        <Button
          variant={"secondary"}
          size={"sm"}
          onClick={clearAll}
          className="rounded-full cursor-pointer"
        >
          Clear All
        </Button>
      )}
    </div>
  );
}
