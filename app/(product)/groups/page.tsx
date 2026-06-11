"use client";

import { Button } from "@/components/ui/button";
import { GroupList } from "@/features/group/components/group-list";
import GroupForm from "@/features/group/forms/group-form";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function GroupsPage() {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-6 w-full">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight">Groups</h1>
            <p className="text-muted-foreground text-sm">
              Manage groups, assign members, and organize you team structure.
            </p>
          </div>
          <Button onClick={() => setFormOpen(true)}>
            <Plus className="size-4" />
            Create Group
          </Button>
        </div>
        <GroupList />
      </div>

      <GroupForm mode="create" open={formOpen} onOpenChange={setFormOpen} />
    </>
  );
}
