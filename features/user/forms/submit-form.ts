"use client";

import { Id } from "@/convex/_generated/dataModel";
import { getChangedFields } from "@/lib/utils";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";
import {
  CreateUserProfile,
  createUserSchema,
  EditUserProfile,
  editUserSchema,
  UserProfile,
} from "../schemas/user.schema";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

async function createUserProfile(
  parsedValues: CreateUserProfile,
  router: AppRouterInstance,
  createUser: ReturnType<typeof useAction<typeof api.users.adminCreateUser>>,
) {
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
}

async function updateUser(
  parsedValues: EditUserProfile,
  user: UserProfile,
  updateUserHook: ReturnType<
    typeof useMutation<typeof api.userProfiles.updateUserProfile>
  >,
  updatePasswordHook: ReturnType<
    typeof useAction<typeof api.users.updateUserPassword>
  >,
) {
  try {
    const changes = getChangedFields(user, parsedValues);
    const hasPasswordChange = parsedValues.password !== "";

    delete changes.password;

    const hasProfileChanges = Object.keys(changes).length > 0;

    if (hasPasswordChange || hasProfileChanges) {
      if (hasPasswordChange) {
        await updatePasswordHook({
          email: parsedValues.email,
          newPassword: parsedValues.password,
        });
      }

      if (hasProfileChanges) {
        await updateUserHook({
          userId: user.userId,
          ...changes,
        });
      }

      toast.success("Changes have been saved.");
    } else {
      toast.info("No update made.");
    }
  } catch (err) {
    toast.error(err instanceof Error ? err.message : "Unable to save changes.");
  }
}

export async function submitUserForm({
  isCreate,
  user,
  value,
  router,
  createUserHook,
  updateUserHook,
  updatePasswordHook,
}: {
  isCreate: boolean;
  user?: UserProfile | null;
  value: UserProfile;
  router: AppRouterInstance;
  createUserHook: ReturnType<
    typeof useAction<typeof api.users.adminCreateUser>
  >;
  updateUserHook: ReturnType<
    typeof useMutation<typeof api.userProfiles.updateUserProfile>
  >;
  updatePasswordHook: ReturnType<
    typeof useAction<typeof api.users.updateUserPassword>
  >;
}) {
  if (isCreate) {
    await createUserProfile(
      createUserSchema.parse(value),
      router,
      createUserHook,
    );
    return;
  }

  if (user) {
    await updateUser(
      editUserSchema.parse(value),
      user,
      updateUserHook,
      updatePasswordHook,
    );
  }
}
