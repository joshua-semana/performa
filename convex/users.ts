import { createAccount } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import { action, mutation } from "./_generated/server";

export const adminCreateUser = action({
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
    const result = await createAccount(ctx, {
      provider: "password",
      account: {
        id: args.email,
        secret: args.firstName,
      },
      profile: {
        email: args.email,
      },
    });

    const userId = (await ctx.runMutation(api.users.createUserProfileByAdmin, {
      userId: result.user._id,
      employeeId: args.employeeId,
      email: args.email,
      firstName: args.firstName,
      middleName: args.middleName,
      lastName: args.lastName,
      suffix: args.suffix,
      gender: args.gender,
      phoneNumber: args.phoneNumber,
      dateOfBirth: args.dateOfBirth,
      hireDate: args.hireDate,
      departmentId: args.departmentId,
      positionId: args.positionId,
      role: args.role,
      status: args.status,
    })) as string;

    return userId;
  },
});

export const createUserProfileByAdmin = mutation({
  args: {
    userId: v.id("users"),
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
      userId: args.userId,
      employeeId: args.employeeId,
      email: args.email,
      firstName: args.firstName,
      middleName: args.middleName,
      lastName: args.lastName,
      suffix: args.suffix,
      gender: args.gender,
      phoneNumber: args.phoneNumber,
      dateOfBirth: args.dateOfBirth,
      hireDate: args.hireDate,
      departmentId: args.departmentId || undefined,
      positionId: args.positionId,
      role: args.role,
      status: args.status,
      searchText:
        `${args.email} ${args.firstName} ${args.lastName} ${args.status}`.toLowerCase(),
    });

    return userId;
  },
});
