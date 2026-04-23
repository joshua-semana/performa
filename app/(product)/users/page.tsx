"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/convex/_generated/api";
import { userColumns } from "@/features/user/components/columns";
import { useDebounce } from "@/hooks/use-debounce";
import { tableConfig } from "@/lib/config/table";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const currentCursor = cursors[pageIndex];

  const [rowsPerPage, setRowsPerPage] = useState(tableConfig.defaultPageSize);

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, tableConfig.debounceMs);

  const result = useQuery(api.userProfiles.getProfiles, {
    paginationOpts: {
      numItems: rowsPerPage,
      cursor: currentCursor,
    },
    search: debouncedSearch || undefined,
  });

  // Resets the table when a search or rows per page changes
  useEffect(() => {
    setPageIndex(0);
    setCursors([null]);
  }, [debouncedSearch, rowsPerPage]);

  // This maps the numerical index of DataTable's page
  // with the Convex cursor-based pagination
  const handleSetPageIndex = (newIndex: number) => {
    if (newIndex > pageIndex && result?.continueCursor) {
      setCursors((prev) => {
        const updated = [...prev];
        updated[newIndex] = result?.continueCursor;
        return updated;
      });
    }

    setPageIndex(newIndex);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage user accounts and permissions for Performa
          </p>
        </div>
        <Link href="/users/new">
          <Button>
            <Plus className="size-4" />
            Add User
          </Button>
        </Link>
      </div>

      <div className="container">
        <DataTable
          data={result?.page ?? []}
          columns={userColumns}
          pageIndex={pageIndex}
          setPageIndex={handleSetPageIndex}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={setRowsPerPage}
          isLoading={result === undefined}
          isDone={result?.isDone ?? false}
          onSearch={setSearch}
          searchValue={search}
        />
      </div>
    </div>
  );
}
