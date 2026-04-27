import { Table } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";

interface DataTableCheckboxHeaderProps<TData> {
  table: Table<TData>;
}

export function DataTableCheckboxHeader<TData>({
  table,
}: DataTableCheckboxHeaderProps<TData>) {
  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="ml-1"
    />
  );
}
