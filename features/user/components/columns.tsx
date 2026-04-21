"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { ColumnDef } from "@tanstack/react-table";

type UserProfileRow = Doc<"userProfiles">;

export const userColumns: ColumnDef<UserProfileRow>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
];
