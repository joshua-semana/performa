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
    positionId: v.optional(v.id("positions")),
    departmentId: v.optional(v.id("departments")),
    status: v.optional(v.string()),

    sortBy: v.optional(v.string()),
    sortOrder: v.optional(v.union(v.literal("asc"), v.literal("desc"))),
  },
  handler: async (ctx, args) => {
    const sortIndexMap = {
      email: "by_email",
      firstName: "by_firstName",
    } as const;

    let result;
    let totalUserCount;
    let totalSearchCount;
    let enrichedPage;

    try {
      const users = await ctx.db.query("userProfiles").collect();
      totalUserCount = users.length;

      if (args.search) {
        const search = args.search.toLowerCase();
        let query = ctx.db.query("userProfiles");

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        const buildSearchQuery = () =>
          query.withSearchIndex("search_users", (q) =>
            q.search("searchText", search),
          );

        result = await buildSearchQuery().paginate(args.paginationOpts);
        totalSearchCount = (await buildSearchQuery().collect()).length;
      } else {
        let query = ctx.db.query("userProfiles");

        const sortIndex =
          args.sortBy && sortIndexMap[args.sortBy as keyof typeof sortIndexMap];

        if (args.status) {
          query = query.filter((q) => q.eq(q.field("status"), args.status));
        }

        if (args.positionId) {
          query = query.filter((q) =>
            q.eq(q.field("positionId"), args.positionId),
          );
        }

        if (args.departmentId) {
          query = query.filter((q) =>
            q.eq(q.field("departmentId"), args.departmentId),
          );
        }

        if (sortIndex) {
          result = await query
            .withIndex(sortIndex, (q) => q)
            .order(args.sortOrder === "desc" ? "desc" : "asc")
            .paginate(args.paginationOpts);
        } else {
          result = await query.paginate(args.paginationOpts);
        }
      }

      enrichedPage = await Promise.all(
        result.page.map(async (user) => {
          const department = user.departmentId
            ? await ctx.db.get(user.departmentId)
            : null;

          const position = await ctx.db.get(user.positionId);

          const departmentName = department?.name;
          const positionName = position?.name;

          return {
            ...user,
            departmentName,
            positionName,
          };
        }),
      );
    } catch (error) {
      console.error("getProfiles failed", error);
      throw new Error("Unable to load users.");
    }

    return {
      ...result,
      page: enrichedPage,
      totalUserCount,
      totalSearchCount,
    };
  },
});
