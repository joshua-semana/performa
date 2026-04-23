"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Doc } from "@/convex/_generated/dataModel";
import { formatFullName } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

type UserProfileRow = Doc<"userProfiles">;

export const userColumns: ColumnDef<UserProfileRow>[] = [
  {
    id: "User",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: ({ row }) => {
      const { firstName, middleName, lastName, suffix, email } = row.original;
      const fullName = formatFullName({
        firstName,
        middleName,
        lastName,
        suffix,
      });
      return (
        <div className="flex space-x-2 items-center">
          <Avatar size="lg">
            <AvatarFallback>{firstName[0] + lastName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="truncate">{fullName}</p>
            <p className="truncate text-muted-foreground text-xs">{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      return (
        <Badge variant={"outline"} className="text-muted-foreground capitalize">
          {row.original.role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Badge variant={"outline"} className="text-muted-foreground capitalize">
          {row.original.status}
        </Badge>
      );
    },
  },
];
