import { COLOR_TYPES } from "@/lib/constants/color";
import { GROUP_TYPES } from "@/lib/constants/group";
import { optionalText, requiredText } from "@/lib/validations/helpers";
import z, { optional } from "zod";

export const baseGroupSchema = z.object({
  id: optionalText(),
  name: requiredText("Name"),
  code: optionalText(),
  description: optionalText(),
  type: z.enum(GROUP_TYPES),
  color: z.enum(COLOR_TYPES),
});

export const createGroupSchema = baseGroupSchema.omit({ id: true });
export const updateGroupSchema = baseGroupSchema.extend({ id: z.string() });

export type BaseGroupSchema = z.infer<typeof baseGroupSchema>;
export type CreateGroupSchema = z.infer<typeof createGroupSchema>;
export type UpdateGroupSchema = z.infer<typeof updateGroupSchema>;
