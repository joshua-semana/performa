"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/convex/_generated/api";
import { userColumns } from "@/features/user/components/columns";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UsersPage() {
  const [pageIndex, setPageIndex] = useState(0);
  const [cursors, setCursors] = useState<(string | null)[]>([null]);
  const currentCursor = cursors[pageIndex];

  const result = useQuery(api.userProfiles.getProfiles, {
    paginationOpts: {
      numItems: 10,
      cursor: currentCursor,
    },
  });

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
          isLoading={result === undefined}
          isDone={result?.isDone ?? false}
        />
      </div>
    </div>
  );
}
