"use client";

import UserForm from "@/features/user/forms/user-form";
import { useRouter } from "next/navigation";

export default function UsersPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6 w-full">
      <UserForm mode="create" />
    </div>
  );
}
