import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { FilterConfig } from "@/lib/types/filter";
import { ListFilter, X } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "./badge";
import { Field, FieldLabel } from "./field";
import { pluralize } from "@/lib/utils";

interface DataTableFilterProps {
  filters: FilterConfig[];
}

function FilterFields({ filters }: { filters: FilterConfig[] }) {
  return (
    <div className="space-y-4">
      {filters.map((filter) => (
        <Field key={filter.key}>
          <FieldLabel>{filter.label}</FieldLabel>
          <Select
            value={filter.value ?? "all"}
            onValueChange={(val) =>
              filter.onChange(val === "all" ? undefined : val)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={filter.placeholder ?? filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{filter.label}</SelectLabel>
                <SelectItem value="all">
                  All {pluralize(filter.label.toLowerCase())}
                </SelectItem>
                {filter.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      ))}
    </div>
  );
}

export default function DataTableFilter({ filters }: DataTableFilterProps) {
  const isMobile = useIsMobile();

  const activeCount = useMemo(() => {
    return filters.filter((f) => f.value).length;
  }, [filters]);

  const clearAll = () => {
    filters.forEach((filter) => filter.onChange(undefined));
  };

  const trigger = (
    <Button variant="outline" className="gap-2">
      <ListFilter />
      Filters
      {activeCount > 0 && (
        <Badge className="font-semibold">{activeCount}</Badge>
      )}
    </Button>
  );

  const content = (
    <div className="space-y-4">
      <FilterFields filters={filters} />
      {activeCount > 0 && (
        <Button variant="ghost" className="w-full gap-2" onClick={clearAll}>
          <X />
          Clear filters
        </Button>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>{trigger}</SheetTrigger>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
          </SheetHeader>
          <div className="m-6">{content}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align="start" className="w-80">
        {content}
      </PopoverContent>
    </Popover>
  );
}
