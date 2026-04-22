// convex/userProfiles.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { query } from "./_generated/server";
import { v } from "convex/values";

export const getCurrentUserProfile = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const profile = await ctx.db
      .query("userProfiles")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    return profile;
  },
});

export const getProfiles = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),

    search: v.optional(v.string()),
    status: v.optional(v.string()),

    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    if (args.search) {
      const search = args.search.toLowerCase();

      return await ctx.db
        .query("userProfiles")
        .withSearchIndex("search_users", (q) => {
          let searchQuery = q.search("searchText", search);

          return searchQuery;
        })
        .paginate(args.paginationOpts);
    }

    let query = ctx.db.query("userProfiles");

    if (args.status) {
      query = query.filter((q) => q.eq(q.field("status"), args.status));
    }

    return await query.paginate(args.paginationOpts);
  },
});
