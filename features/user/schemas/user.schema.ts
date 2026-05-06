import {
  optionalPhone,
  optionalText,
  requiredText,
} from "@/lib/validations/helpers";
import z from "zod";

export const statusSchema = z.enum(["active", "suspended"]);

export const baseUserProfileSchema = z.object({
  userId: optionalText(),

  employeeId: requiredText("Employee ID"),
  email: z.email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),

  firstName: requiredText("First Name"),
  middleName: optionalText(),
  lastName: requiredText("Last Name"),
  suffix: optionalText(),

  gender: z.string(),

  phoneNumber: optionalPhone(),

  dateOfBirth: optionalText(),
  hireDate: optionalText(),

  departmentId: optionalText(),
  positionId: requiredText("Position"),
  role: requiredText("Role"),

  status: statusSchema,
});

export const createUserSchema = baseUserProfileSchema.omit({ userId: true });

export const editUserSchema = baseUserProfileSchema.extend({
  userId: z.string(),

  password: z.union([
    z.literal(""),
    z.string().min(8, "Password must be at least 8 characters."),
  ]),
});

export type UserProfile = z.infer<typeof baseUserProfileSchema>;
export type CreateUserProfile = z.infer<typeof createUserSchema>;
export type EditUserProfile = z.infer<typeof editUserSchema>;
