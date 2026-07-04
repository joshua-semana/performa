"use client";

import { FormPaletteField } from "@/components/form-palette-field";
import { FormSelectField } from "@/components/form-select-field";
import { FormTextField } from "@/components/form-text-field";
import { FormTextAreaField } from "@/components/form-textarea-field";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import { ColorType } from "@/lib/constants/color";
import { GroupType, groupTypeOptions } from "@/lib/constants/group";
import { useForm } from "@tanstack/react-form";
import { Loader2, Save } from "lucide-react";
import {
  BaseGroupSchema,
  baseGroupSchema,
  createGroupSchema,
  updateGroupSchema,
} from "../schemas/group.schema";
import { useEffect, useMemo } from "react";
import { useGroupSubmitForm } from "../hooks/use-group-submit-form";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface GroupFormProps {
  id?: string;
  mode: "edit" | "create";

  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function GroupForm({
  id,
  mode,
  open,
  onOpenChange,
}: GroupFormProps) {
  const isCreate = mode === "create";

  const { handleCreateGroup, handleUpdateGroup } = useGroupSubmitForm();
  const group = useQuery(api.groups.getGroupByID, id ? { id: id } : "skip");
  const groupItem = useMemo<BaseGroupSchema | undefined | null>(() => {
    if (group === undefined) return undefined;
    if (group === null) return null;

    return {
      id: String(group._id),
      name: group.name ?? "",
      code: group.code ?? "",
      description: group.description ?? "",
      type: (group.type as GroupType) ?? "DEPARTMENT",
      color: (group.color as ColorType) ?? "amber",
    };
  }, [group]);

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      description: "",
      type: "DEPARTMENT" as GroupType,
      color: "amber" as ColorType,
    },
    validators: {
      onSubmit: isCreate ? createGroupSchema : updateGroupSchema,
    },
    onSubmit: async ({ value }) => {
      let result;

      if (isCreate) {
        result = handleCreateGroup({
          parsedValues: createGroupSchema.parse(value),
        });
      } else {
        if (groupItem) {
          result = handleUpdateGroup({
            originalValues: groupItem,
            parsedValues: updateGroupSchema.parse(value),
          });
        }
      }

      if (result) {
        onOpenChange(false);
      }

      console.log("Success: ", result);
      console.table(value);
    },
  });

  useEffect(() => {
    if (isCreate) {
      form.reset();
    } else if (groupItem) {
      form.reset(groupItem);
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogDescription>
            Add a new group to organize your users.
          </DialogDescription>
        </DialogHeader>

        <form
          id="form-create-group"
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => (
                <FormTextField
                  field={field}
                  label="Name"
                  placeholder="e.g., Science Department"
                  type="text"
                  required
                />
              )}
            </form.Field>

            <div className="grid grid-cols-2 gap-2">
              <form.Field name="code">
                {(field) => (
                  <FormTextField
                    field={field}
                    label="Code"
                    placeholder="e.g., SCI_DEPT"
                    type="text"
                  />
                )}
              </form.Field>

              <form.Field name="type">
                {(field) => (
                  <FormSelectField
                    field={field}
                    label="Type"
                    placeholder="Select a type"
                    required
                    options={groupTypeOptions}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="color">
              {(field) => <FormPaletteField field={field} label="Color" />}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <FormTextAreaField
                  field={field}
                  label="Description"
                  placeholder="Brief description of this group..."
                  maxLength={100}
                />
              )}
            </form.Field>
            <div className="flex justify-end gap-4">
              <Button
                variant="ghost"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
              >
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin" />
                        {isCreate ? "Creating ..." : "Saving ..."}
                      </>
                    ) : (
                      <>
                        <Save />
                        {isCreate ? "Create Group" : "Save Changes"}
                      </>
                    )}
                  </Button>
                )}
              </form.Subscribe>
            </div>
          </FieldGroup>
        </form>
      </DialogContent>
    </Dialog>
  );
}
