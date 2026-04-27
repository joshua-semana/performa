"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { userColumns } from "@/features/user/components/columns";
import { useTableState } from "@/hooks/use-data-table-state";
import { appConfig } from "@/lib/config/app";
import { userStatusOptions } from "@/lib/constants/user";
import { SelectOption } from "@/lib/types/common";
import { useQuery } from "convex/react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function UsersPage() {
  const tableState = useTableState();
  const departments = useQuery(api.departments.getDepartments);
  const positions = useQuery(api.positions.getPositions);

  const [departmentId, setDepartmentId] = useState<string>();
  const [positionId, setPositionId] = useState<string>();
  const [status, setStatus] = useState<string>();

  const departmentOptions: SelectOption[] =
    departments?.map((department) => ({
      label: department.name,
      value: department._id,
    })) ?? [];

  const positionOptions: SelectOption[] =
    positions?.map((position) => ({
      label: position.name,
      value: position._id,
    })) ?? [];

  const result = useQuery(api.userProfiles.getProfiles, {
    paginationOpts: {
      numItems: tableState.rowsPerPage,
      cursor: tableState.currentCursor,
    },
    search: tableState.debouncedSearch || undefined,
    sortBy: tableState.sortBy,
    sortOrder: tableState.sortOrder,
    departmentId: departmentId as Id<"departments">,
    positionId: positionId as Id<"positions">,
    status: status,
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <h1 className="text-2xl font-semibold tracking-tight">Users</h1>
          <p className="text-muted-foreground text-sm">
            Manage user accounts and permissions for {appConfig.name}
          </p>
        </div>
        <Link href="/users/new">
          <Button>
            <Plus className="size-4" />
            Add User
          </Button>
        </Link>
      </div>

      <DataTable
        data={result?.page ?? []}
        columns={userColumns}
        getRowId={(row) => row._id}
        pageIndex={tableState.pageIndex}
        setPageIndex={(index) =>
          tableState.setPageIndex(index, result?.continueCursor)
        }
        rowsPerPage={tableState.rowsPerPage}
        onRowsPerPageChange={tableState.setRowsPerPage}
        isLoading={result === undefined}
        isDone={result?.isDone ?? true}
        onSearch={tableState.setSearch}
        searchValue={tableState.search}
        sorting={tableState.sorting}
        onSortingChange={tableState.setSorting}
        totalSearchCount={result?.totalSearchCount}
        totalUserCount={result?.totalUserCount}
        hasViewOptions
        filters={[
          {
            key: "status",
            label: "Status",
            value: status,
            options: userStatusOptions,
            onChange: setStatus,
          },
          {
            key: "position",
            label: "Position",
            value: positionId,
            options: positionOptions,
            onChange: setPositionId,
          },
          {
            key: "department",
            label: "Department",
            value: departmentId,
            options: departmentOptions,
            onChange: setDepartmentId,
          },
        ]}
      />
    </div>
  );
}
