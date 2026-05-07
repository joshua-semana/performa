import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getChangedFields } from "@/lib/utils";
import { useAction, useMutation } from "convex/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  CreateUserProfile,
  EditUserProfile,
  UserProfile,
} from "../schemas/user.schema";

export function useUserSubmitForm() {
  const updateUser = useMutation(api.userProfiles.updateUserProfile);
  const createUser = useAction(api.users.adminCreateUser);
  const updatePassword = useAction(api.users.updateUserPassword);

  const router = useRouter();

  const handleCreateUser = async ({
    parsedValues,
  }: {
    parsedValues: CreateUserProfile;
  }) => {
    try {
      await createUser({
        ...parsedValues,
        departmentId: parsedValues.departmentId
          ? (parsedValues.departmentId as Id<"departments">)
          : undefined,
        positionId: parsedValues.positionId as Id<"positions">,
      });

      toast.success(`You have created an account for ${parsedValues.email}.`);
      router.push("/users");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    }
  };

  const handleUpdateUser = async ({
    user,
    parsedValues,
  }: {
    user: UserProfile;
    parsedValues: EditUserProfile;
  }) => {
    try {
      const changes = getChangedFields(user, parsedValues);
      const hasPasswordChange = parsedValues.password !== "";

      delete changes.password;

      const hasProfileChanges = Object.keys(changes).length > 0;

      if (hasPasswordChange || hasProfileChanges) {
        if (hasPasswordChange) {
          await updatePassword({
            email: parsedValues.email,
            newPassword: parsedValues.password,
          });
        }

        if (hasProfileChanges) {
          await updateUser({
            userId: user.userId,
            ...changes,
          });
        }

        toast.success("Changes have been saved.");
      } else {
        toast.info("No update made.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to save changes.",
      );
    }
  };

  return { handleCreateUser, handleUpdateUser };
}
