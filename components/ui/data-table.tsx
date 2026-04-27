"use client";

import {
  ColumnDef,
  getCoreRowModel,
  OnChangeFn,
  RowData,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

import React, { useEffect, useState } from "react";
import { DataTableContent } from "./data-table-content";
import { DataTableFooter } from "./data-table-footer";
import { DataTableToolbar } from "./data-table-toolbar";
import { FilterConfig } from "@/lib/types/filter";

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
  filters?: FilterConfig[];
  hasViewOptions?: boolean;

  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;

  totalSearchCount?: number;
  totalUserCount?: number;
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
  hasViewOptions = false,
  filters,
  sorting,
  onSortingChange,
  totalSearchCount,
  totalUserCount,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({});

  useEffect(() => {
    setRowSelection({});
  }, [pageIndex]);

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
      <DataTableToolbar
        table={table}
        onSearch={onSearch}
        searchValue={searchValue}
        hasViewOptions={hasViewOptions}
        filters={filters}
      />

      <DataTableContent columns={columns} table={table} isLoading={isLoading} />

      <DataTableFooter
        table={table}
        isDone={isDone}
        isLoading={isLoading}
        pageIndex={pageIndex}
        setPageIndex={setPageIndex}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={onRowsPerPageChange}
        totalSearchCount={totalSearchCount}
        totalUserCount={totalUserCount}
        searchValue={searchValue}
      />
    </div>
  );
}
