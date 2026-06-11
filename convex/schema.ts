import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { GROUP_TYPES } from "../lib/constants/group";
import { COLOR_TYPES } from "../lib/constants/color";

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
    updatedAt: v.optional(v.string()),
  })
    .index("by_userId", ["userId"])
    .index("by_email", ["email"])
    .index("by_firstName", ["firstName"])
    .index("by_status", ["status"])
    .searchIndex("search_users", {
      searchField: "searchText",
    }),

  groups: defineTable({
    name: v.string(),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(...GROUP_TYPES.map((type) => v.literal(type))),
    color: v.union(...COLOR_TYPES.map((type) => v.literal(type))),
    memberCount: v.number(),
    archived: v.boolean(),
    isAssignable: v.boolean(),
    updatedAt: v.number(), //So we can use Date.now() without converting it to ISOString()
  })
    .index("by_archived_type", ["archived", "type"])
    .index("by_archived", ["archived"])
    .searchIndex("search_groups", {
      searchField: "name",
    }),
});

export default schema;
