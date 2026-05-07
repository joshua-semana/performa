"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  title: string;
  description?: string;

  onConfirm: () => Promise<void> | void;

  confirmText?: string;
  cancelText?: string;

  destructive?: boolean;
  loadingText?: string;

  closeOnConfirm?: boolean;
};

export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,

  confirmText = "Confirm",
  cancelText = "Cancel",

  destructive = false,
  loadingText = "Processing...",

  closeOnConfirm = true,
}: ConfirmDialogProps) {
  const [isLoading, setIsLoading] = React.useState(false);

  async function handleConfirm() {
    try {
      setIsLoading(true);

      await onConfirm();

      if (closeOnConfirm) {
        onOpenChange(false);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>

          {description && (
            <AlertDialogDescription className="text-pretty">
              {description}
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>
            {cancelText}
          </AlertDialogCancel>

          <AlertDialogAction
            variant={destructive ? "destructive" : "default"}
            onClick={(e) => {
              e.preventDefault(); // prevent auto-close
              void handleConfirm();
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                {loadingText}
              </>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
