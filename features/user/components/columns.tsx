"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
import { Doc } from "@/convex/_generated/dataModel";
import { columnSizes } from "@/lib/config/table";
import { getAvatarColor, getStatusColor } from "@/lib/ui";
import { cn, formatFullName } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

type UserProfileRow = Doc<"userProfiles"> & {
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
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-1"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-1"
      />
    ),
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
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col ">
            <p className="truncate font-medium">{fullName}</p>
            <p className="text-xs text-muted-foreground capitalize">{role}</p>
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
];
