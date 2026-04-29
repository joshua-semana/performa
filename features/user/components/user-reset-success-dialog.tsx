import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { useState } from "react";

interface UserResetSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  fullName: string;
  newPassword: string;

  onClose: () => void;
}

export function UserResetSuccessDialog({
  open,
  onOpenChange,
  newPassword,
  fullName,
}: UserResetSuccessDialogProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Password Reset Successful</AlertDialogTitle>
          <AlertDialogDescription>
            The new password for{" "}
            <span className="font-semibold">{fullName}</span>
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="rounded-md border p-2 font-mono bg-card text-center">
          {newPassword}
        </div>

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => copy(newPassword)}>
            {copied ? "Copied!" : "Copy password"}
          </Button>

          <AlertDialogAction>Done</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
