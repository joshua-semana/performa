"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { Button } from "./button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  pageIndex: number;
  setPageIndex: (index: number) => void;

  isLoading: boolean;
  isDone: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageIndex,
  setPageIndex,
  isLoading,
  isDone,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),

    manualPagination: true,
    pageCount: -1,
    state: {
      pagination: {
        pageIndex,
        pageSize: data.length,
      },
    },
  });

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
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
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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

      <div className="flex items-center justify-between">
        <Button
          onClick={() => setPageIndex(pageIndex - 1)}
          disabled={pageIndex === 0}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Prev
        </Button>

        <span>Page {pageIndex + 1}</span>

        <Button
          onClick={() => setPageIndex(pageIndex + 1)}
          disabled={isDone}
          className="border px-3 py-1 rounded disabled:opacity-50"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
