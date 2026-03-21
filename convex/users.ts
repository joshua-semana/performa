import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUserByAdmin = mutation({
  args: {
    employeeId: v.string(),
    email: v.string(),
    firstName: v.string(),
    middleName: v.optional(v.string()),
    lastName: v.string(),
    suffix: v.optional(v.string()),
    gender: v.string(),
    phoneNumber: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    hireDate: v.optional(v.string()),
    departmentId: v.optional(v.id("departments")),
    positionId: v.id("positions"),
    role: v.string(),
    status: v.string(),
  },

  handler: async (ctx, args) => {
    const userId = await ctx.db.insert("userProfiles", {
      employeeId: args.employeeId,
      email: args.email,
      firstName: args.firstName,
      middleName: args.middleName ?? "",
      lastName: args.lastName,
      suffix: args.suffix ?? "",
      gender: args.gender,
      phoneNumber: args.phoneNumber ?? "",
      dateOfBirth: args.dateOfBirth ?? "",
      hireDate: args.hireDate ?? "",
      departmentId: args.departmentId || undefined,
      positionId: args.positionId,
      role: args.role,
      status: args.status,
    });

    return userId;
  },
});
