"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KeyRound, MoreVertical, Pencil, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { UserProfileRow } from "./columns";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUserActions } from "../hooks/use-user-actions";
import { formatFullName } from "@/lib/utils";
import { UserResetSuccessDialog } from "./user-reset-success-dialog";

interface UserRowActionsProps {
  user: UserProfileRow;
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const isActivated = user.status === "active";
  const fullName = formatFullName({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    suffix: user.suffix,
  });

  const { handleUpdateStatus, handleResetPassword } = useUserActions();

  const [statusOpen, setStatusOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  async function onResetPassword() {
    const result = await handleResetPassword(user.email);

    if (result?.success) {
      setNewPassword(result.password);
      setPasswordOpen(true);
    }
  }

  function handleClosePasswordDialog() {
    setPasswordOpen(false);
    setNewPassword("");
  }

  return (
    <>
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResetOpen(true)}>
              <KeyRound />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isActivated ? (
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setStatusOpen(true)}
              >
                <UserX />
                Suspend User
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                variant="default"
                onSelect={() => setStatusOpen(true)}
              >
                <UserCheck />
                Activate User
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={isActivated ? "Suspend User" : "Activate User"}
        description={
          isActivated
            ? `Are you sure you want to suspend ${fullName}?`
            : `Are you sure you want to activate ${fullName}?`
        }
        onConfirm={() =>
          handleUpdateStatus(user._id, isActivated ? "suspended" : "active")
        }
        destructive={isActivated}
        confirmText={isActivated ? "Suspend" : "Activate"}
      />

      <ConfirmDialog
        open={resetOpen}
        onOpenChange={setResetOpen}
        title="Password Reset"
        description={`Are you sure you want to reset the password of ${fullName}?`}
        confirmText="Reset Password"
        onConfirm={onResetPassword}
      />

      <UserResetSuccessDialog
        open={passwordOpen}
        onOpenChange={setPasswordOpen}
        fullName={fullName}
        newPassword={newPassword}
        onClose={handleClosePasswordDialog}
      />
    </>
  );
}
