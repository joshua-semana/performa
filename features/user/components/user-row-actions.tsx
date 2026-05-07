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
import {
  Archive,
  ArchiveRestore,
  KeyRound,
  MoreVertical,
  Pencil,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { UserProfileRow } from "./columns";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { useUserActions } from "../hooks/use-user-actions";
import { formatFullName } from "@/lib/utils";
import { UserResetSuccessDialog } from "./user-reset-success-dialog";
import { useRouter } from "next/navigation";
import { ACTIVE, ARCHIVED, SUSPENDED } from "@/lib/constants/user";

interface UserRowActionsProps {
  user: UserProfileRow;
}

export function UserRowActions({ user }: UserRowActionsProps) {
  const router = useRouter();
  const isActivated = user.status === ACTIVE;
  const isUnarchived = !(user.status === ARCHIVED);
  const fullName = formatFullName({
    firstName: user.firstName,
    middleName: user.middleName,
    lastName: user.lastName,
    suffix: user.suffix,
  });

  const { handleUpdateStatus, handleResetPassword } = useUserActions();

  const [statusOpen, setStatusOpen] = useState(false);
  const [archiveOpen, setArchiveOpen] = useState(false);
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
            <DropdownMenuItem
              onSelect={() => router.push(`/users/${user._id}/edit`)}
            >
              <Pencil /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setResetOpen(true)}>
              <KeyRound />
              Reset Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {isUnarchived && (
              <DropdownMenuItem
                variant={isActivated ? "destructive" : "default"}
                onSelect={() => setStatusOpen(true)}
              >
                {isActivated ? (
                  <>
                    <UserX />
                    Suspend User
                  </>
                ) : (
                  <>
                    <UserCheck />
                    Activate User
                  </>
                )}
              </DropdownMenuItem>
            )}

            <DropdownMenuItem
              variant={isUnarchived ? "destructive" : "default"}
              onSelect={() => setArchiveOpen(true)}
            >
              {isUnarchived ? (
                <>
                  <Archive />
                  Archive User
                </>
              ) : (
                <>
                  <ArchiveRestore />
                  Restore User
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ConfirmDialog
        open={statusOpen}
        onOpenChange={setStatusOpen}
        title={isActivated ? "Suspend User" : "Activate User"}
        description={
          isActivated
            ? `Are you sure you want to suspend the account of ${fullName}?`
            : `Are you sure you want to activate the account of ${fullName}?`
        }
        onConfirm={() =>
          handleUpdateStatus(user._id, isActivated ? SUSPENDED : ACTIVE)
        }
        destructive={isActivated}
        confirmText={isActivated ? "Suspend" : "Activate"}
      />

      <ConfirmDialog
        open={archiveOpen}
        onOpenChange={setArchiveOpen}
        title={isUnarchived ? "Archive User" : "Restore User"}
        description={
          isUnarchived
            ? `Are you sure you want to archive the account of ${fullName}?`
            : `Are you sure you want to restore the account of ${fullName}?`
        }
        onConfirm={() =>
          handleUpdateStatus(user._id, isUnarchived ? ARCHIVED : ACTIVE)
        }
        destructive={isUnarchived}
        confirmText={isUnarchived ? "Archive" : "Restore"}
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
