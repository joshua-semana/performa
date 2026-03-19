import { Button } from "@/components/ui/button";
import { wait } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function UsersPage() {
  await wait(2000); // 2 seconds delay
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
    </div>
  );
}
