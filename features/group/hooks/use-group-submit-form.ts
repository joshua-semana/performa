import { api } from "@/convex/_generated/api";
import { useMutation } from "convex/react";
import {
  BaseGroupSchema,
  CreateGroupSchema,
  UpdateGroupSchema,
} from "../schemas/group.schema";
import { toast } from "sonner";
import { getChangedFields } from "@/lib/utils";

export function useGroupSubmitForm() {
  const createGroup = useMutation(api.groups.createGroup);
  const updateGroup = useMutation(api.groups.updateGroup);

  const handleCreateGroup = async ({
    parsedValues,
  }: {
    parsedValues: CreateGroupSchema;
  }) => {
    try {
      await createGroup(parsedValues);

      toast.success(`You have created a new group: ${parsedValues.name}`);
      return { success: true };
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
      return { success: false };
    }
  };

  const handleUpdateGroup = async ({
    originalValues,
    parsedValues,
  }: {
    originalValues: BaseGroupSchema;
    parsedValues: UpdateGroupSchema;
  }) => {
    try {
      const changes = getChangedFields(originalValues, parsedValues);
      const hasChanges = Object.keys(changes).length > 0;

      if (hasChanges) {
        await updateGroup({
          id: parsedValues.id,
          ...changes,
        });
        toast.success("Changes have been saved.");
        return { success: true };
      } else {
        toast.info("No update made.");
        return { success: false };
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Unable to save changes.",
      );
      return { success: false };
    }
  };

  return { handleCreateGroup, handleUpdateGroup };
}
