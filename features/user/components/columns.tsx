"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DataTableCheckboxHeader } from "@/components/ui/data-table-checkbox-header";
import { DataTableCheckboxRow } from "@/components/ui/data-table-checkbox-row";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import { columnSizes } from "@/lib/config/table";
import { getAvatarColor } from "@/lib/theme/avatar";
import { getStatusColor } from "@/lib/theme/status";
import { capitalize, cn, formatFullName } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { UserPreview } from "./user-preview";
import { UserRowActions } from "./user-row-actions";

export type UserProfileRow = Doc<"userProfiles"> & {
  departmentName: string | undefined;
  positionName: string | undefined;
};

const statusStyles: Record<string, string> = {
  active: "text-emerald-400 border-emerald-400/30",
  inactive: "text-muted-foreground",
};

export const userColumns: ColumnDef<UserProfileRow>[] = [
  {
    id: "select",
    header: ({ table }) => <DataTableCheckboxHeader table={table} />,
    cell: ({ row }) => <DataTableCheckboxRow row={row} />,
    size: 20,
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "firstName",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="User" />;
    },
    accessorFn: (row) => `${row.firstName}`,
    minSize: columnSizes.primary.min,
    maxSize: columnSizes.primary.ideal,
    enableHiding: false,
    cell: ({ row }) => {
      const { firstName, middleName, lastName, suffix, role } = row.original;
      const fullName = formatFullName({
        firstName,
        middleName,
        lastName,
        suffix,
      });
      const initials = firstName[0] + lastName[0];
      return (
        <div className="flex space-x-1.5 items-center">
          <Avatar size="lg">
            <AvatarFallback className={cn(getAvatarColor(initials))}>
              {initials.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-center max-w-60">
            <UserPreview user={row.original} />
            <p className="text-xs text-muted-foreground capitalize truncate">
              {capitalize(role)}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return <DataTableColumnHeader column={column} title="Email" />;
    },
    size: columnSizes.secondary.size,
    enableHiding: false,
  },
  {
    id: "Position", // For view toggle
    accessorKey: "positionName",
    header: "Position",
    size: columnSizes.tertiary.size,
  },
  {
    id: "Department", // For view toggle
    accessorKey: "departmentName",
    header: "Department",
    size: columnSizes.tertiary.size,
    cell: ({ row }) => {
      const display = row.original.departmentName ?? "Not Assigned";
      const isFallback = !row.original.departmentName;

      return (
        <p className={cn(isFallback && "text-muted-foreground italic")}>
          {display}
        </p>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    size: columnSizes.meta.size,
    cell: ({ row }) => {
      return (
        <Badge
          variant={"outline"}
          className={cn(
            "capitalize rounded-sm font-semibold",
            getStatusColor(row.original.status),
          )}
        >
          {row.original.status}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    size: columnSizes.action.size,
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return <UserRowActions user={row.original} />;
    },
  },
];
