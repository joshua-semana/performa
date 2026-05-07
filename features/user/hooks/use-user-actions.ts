import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAction, useMutation } from "convex/react";

export function useUserActions() {
  const updateStatus = useMutation(api.userProfiles.updateUserStatus);
  const resetPassword = useAction(api.users.resetUserPassword);

  const handleUpdateStatus = async (
    id: Id<"userProfiles">,
    newStatus: "active" | "suspended" | "archived",
  ) => {
    await updateStatus({ userId: id, status: newStatus });
  };

  const handleResetPassword = async (email: string) => {
    return await resetPassword({ email: email });
  };

  return {
    handleUpdateStatus,
    handleResetPassword,
  };
}
