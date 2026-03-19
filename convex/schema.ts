import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  departments: defineTable({
    name: v.string(),
    // The user who is head of the department,
    // Maybe useful later for who can evaluate who
    headId: v.optional(v.id("users")),
  }),

  positions: defineTable({
    name: v.string(),
  }),

  userProfiles: defineTable({
    userId: v.id("users"),

    employeeId: v.string(),
    email: v.string(),

    firstName: v.string(),
    middleName: v.optional(v.string()),
    lastName: v.string(),
    suffix: v.optional(v.string()),

    gender: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    dateOfBirth: v.optional(v.number()),
    hireDate: v.optional(v.number()),

    departmentId: v.optional(v.id("departments")),
    positionId: v.optional(v.id("positions")),
    role: v.string(),

    isActive: v.boolean(),
  }),
});

export default schema;
