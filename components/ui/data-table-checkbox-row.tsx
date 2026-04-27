import { Row } from "@tanstack/react-table";
import { Checkbox } from "./checkbox";

interface DataTableCheckboxRowProps<TData> {
  row: Row<TData>;
}

export function DataTableCheckboxRow<TData>({
  row,
}: DataTableCheckboxRowProps<TData>) {
  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="ml-1"
    />
  );
}
