import { Table } from "@tanstack/react-table";
import { Search } from "lucide-react";
import { DataTableViewOptions } from "./data-table-view-options";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import DataTableFilter from "./data-table-filter";
import { FilterConfig } from "@/lib/types/filter";
import { DataTableFilterChips } from "./data-table-filter-chips";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  onSearch?: (value: string) => void;
  searchValue?: string;
  hasViewOptions?: boolean;
  filters?: FilterConfig[];
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  searchValue,
  hasViewOptions,
  filters,
}: DataTableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <InputGroup className="max-w-sm">
          <InputGroupInput
            placeholder="Search ..."
            value={searchValue ?? ""}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        {filters && <DataTableFilter filters={filters} />}

        {hasViewOptions && <DataTableViewOptions table={table} />}
      </div>

      {filters && <DataTableFilterChips filters={filters} />}
    </div>
  );
}
