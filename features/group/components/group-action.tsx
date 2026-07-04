"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, Pencil, Trash } from "lucide-react";
import GroupForm from "../forms/group-form";
import { useState } from "react";

export function GroupAction({ id }: { id: string }) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="ml-auto" size={"icon"} variant={"ghost"}>
            <EllipsisVertical className="size-4 shrink-0" />{" "}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuLabel>Group Actions</DropdownMenuLabel>
          <DropdownMenuItem onSelect={() => setFormOpen(true)}>
            <Pencil />
            Edit Details
          </DropdownMenuItem>
          <DropdownMenuItem variant="destructive">
            <Trash /> Delete Group
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {id && (
        <GroupForm
          mode="edit"
          id={id}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}
    </>
  );
}
