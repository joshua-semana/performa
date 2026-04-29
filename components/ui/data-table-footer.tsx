import { tableConfig } from "@/lib/config/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Button } from "./button";
import { ChevronFirst, ChevronLeft, ChevronRight } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Table } from "@tanstack/react-table";

interface DataTableFooterProps<TData> {
  table: Table<TData>;

  isLoading: boolean;
  isDone: boolean;

  pageIndex: number;
  setPageIndex: (index: number) => void;

  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;

  totalSearchCount?: number;
  totalUserCount?: number;

  searchValue?: string;
}

export function DataTableFooter<TData>({
  table,
  isDone,
  isLoading,
  pageIndex,
  setPageIndex,
  rowsPerPage,
  onRowsPerPageChange,
  totalSearchCount,
  totalUserCount,
  searchValue,
}: DataTableFooterProps<TData>) {
  const debouncedSearch = useDebounce(searchValue, tableConfig.debounceMs);

  const selectedCount = table.getSelectedRowModel().rows.length;
  const currentPageCount = table.getRowModel().rows.length;

  const totalPages = Math.max(
    1,
    Math.ceil((totalSearchCount ?? totalUserCount ?? 0) / rowsPerPage),
  );

  function getFooterText() {
    if (selectedCount > 0) {
      return `${selectedCount} of ${currentPageCount} row(s) selected on this page.`;
    }

    if (debouncedSearch && isLoading) {
      return "Searching users...";
    }

    if (debouncedSearch && !isLoading) {
      if (totalSearchCount === 0) {
        return `No users found · ${totalUserCount} total users.`;
      }

      return `${totalSearchCount} matching users · ${totalUserCount} total users.`;
    }

    if (isLoading) {
      return "Loading users...";
    }

    if (totalUserCount === 0) {
      return "No users available.";
    }

    return `${totalUserCount} total users.`;
  }

  return (
    <div className="flex flex-col items-center gap-4 md:flex-row md:items-center md:justify-between">
      <div className="items-center gap-4 hidden sm:flex">
        Rows per page
        <Select
          disabled={isLoading}
          value={rowsPerPage.toString()}
          onValueChange={(e) => onRowsPerPageChange(Number(e))}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sizes</SelectLabel>
              {tableConfig.pageSizeOptions.map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* User Count / Search Count / Selected Rows */}
      <div className="text-sm text-muted-foreground transition-all duration-200">
        <p>{getFooterText()}</p>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-4">
        <Button
          onClick={() => setPageIndex(0)}
          disabled={pageIndex === 0}
          variant={"outline"}
          size={"icon"}
        >
          <ChevronFirst />
        </Button>

        <span>
          Page {pageIndex + 1} of {totalPages}
        </span>

        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          variant={"outline"}
          size={"icon"}
        >
          <ChevronLeft />
        </Button>

        <Button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={pageIndex + 1 >= totalPages}
          variant={"outline"}
          size={"icon"}
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
