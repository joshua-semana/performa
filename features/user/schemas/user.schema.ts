import z from "zod";

export const baseUserProfileSchema = z.object({
  userId: z.string().or(z.literal("")),

  employeeId: z.string().trim().min(1, "Employee ID is required."),
  email: z.email("Please enter a valid email address."),

  firstName: z.string().trim().min(1, "First name is required."),
  middleName: z.string().trim().or(z.literal("")),
  lastName: z.string().trim().min(1, "Last name is required."),
  suffix: z.string().trim().or(z.literal("")),

  gender: z.string(),
  phoneNumber: z
    .string()
    .regex(/^[0-9]{9}$/, "Phone number must contain 9 digits")
    .or(z.literal("")),
  dateOfBirth: z.string().or(z.literal("")),
  hireDate: z.string().or(z.literal("")),

  departmentId: z.string().or(z.literal("")),
  positionId: z.string().min(1, "Position is required."),
  role: z.string().min(1, "Role is required."),

  status: z.enum(["active", "inactive"]),
});

export const createUserSchema = baseUserProfileSchema.omit({ userId: true });

export const editUserSchema = baseUserProfileSchema.extend({
  userId: z.string(),
});

export type UserProfile = z.infer<typeof baseUserProfileSchema>;
