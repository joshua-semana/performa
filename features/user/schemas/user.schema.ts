import z from "zod";

export const baseUserProfileSchema = z.object({
  userId: z.string().or(z.literal("")),

  employeeId: z.string().min(1),
  email: z.email(),

  firstName: z.string().min(1),
  middleName: z.string().or(z.literal("")),
  lastName: z.string().min(1),
  suffix: z.string().or(z.literal("")),

  gender: z.string().or(z.literal("")),
  phoneNumber: z.string().or(z.literal("")),
  dateOfBirth: z.string().or(z.literal("")),
  hireDate: z.string().or(z.literal("")),

  departmentId: z.string().or(z.literal("")),
  positionId: z.string().or(z.literal("")),
  role: z.string(),

  isActive: z.boolean(),
});

export const createUserSchema = baseUserProfileSchema.omit({ userId: true });

export const editUserSchema = baseUserProfileSchema.extend({
  userId: z.string(),
});

export type UserProfile = z.infer<typeof baseUserProfileSchema>;
