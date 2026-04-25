"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  OnChangeFn,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { tableConfig } from "@/lib/config/table";
import { ChevronFirst, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Button } from "./button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";
import { DataTableViewOptions } from "./data-table-view-options";
import { useState } from "react";

interface DataTableProps<TData extends RowData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  getRowId?: (row: TData) => string;

  pageIndex: number;
  setPageIndex: (index: number) => void;

  rowsPerPage: number;
  onRowsPerPageChange: (value: number) => void;

  isLoading: boolean;
  isDone: boolean;

  onSearch?: (value: string) => void;
  searchValue?: string;

  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  getRowId,
  pageIndex,
  setPageIndex,
  rowsPerPage,
  onRowsPerPageChange,
  isLoading,
  isDone,
  onSearch,
  searchValue,
  sorting,
  onSortingChange,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,
    getRowId,

    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,

    manualPagination: true,
    pageCount: -1,
    state: {
      rowSelection,
      sorting,
      pagination: {
        pageIndex,
        pageSize: rowsPerPage,
      },
    },

    onSortingChange,
    manualSorting: true,
    enableMultiSort: false,
  });

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="flex">
        <InputGroup className="max-w-72">
          <InputGroupInput
            placeholder="Search ..."
            value={searchValue ?? ""}
            onChange={(e) => onSearch?.(e.target.value)}
          />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>

        <DataTableViewOptions table={table} />
      </div>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center animate-pulse text-muted-foreground"
                >
                  Loading data, please wait ...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Rows per Page */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
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

        {/* Selected Rows */}
        <div className="text-sm text-muted-foreground">
          {table.getSelectedRowModel().rows.length} of{" "}
          {table.getRowModel().rows.length} row(s) selected on this page.
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-4">
          <Button
            onClick={() => setPageIndex(pageIndex - 1)}
            disabled={pageIndex === 0}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronFirst />
          </Button>

          <span>Page {pageIndex + 1} of many</span>

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
            disabled={isDone || isLoading}
            variant={"outline"}
            size={"icon"}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
