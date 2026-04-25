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
  }).index("by_name", ["name"]),

  positions: defineTable({
    name: v.string(),
  }).index("by_name", ["name"]),

  userProfiles: defineTable({
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

    searchText: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_firstName", ["firstName"])
    .searchIndex("search_users", {
      searchField: "searchText",
    }),
});

export default schema;
