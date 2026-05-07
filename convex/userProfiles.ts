// convex/userProfiles.ts
import { getAuthUserId } from "@convex-dev/auth/server";
import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

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

    try {
      const totalUserCount = (await ctx.db.query("userProfiles").collect())
        .length;

      let result;
      let totalSearchCount: number | undefined;

      if (args.search) {
        const search = args.search.toLowerCase();

        const searchResults = await ctx.db
          .query("userProfiles")
          .withSearchIndex("search_users", (q) =>
            q.search("searchText", search),
          )
          .collect();

        const filtered = searchResults.filter((user) => {
          if (args.status && user.status !== args.status) return false;
          if (args.positionId && user.positionId !== args.positionId)
            return false;
          if (args.departmentId && user.departmentId !== args.departmentId)
            return false;
          return true;
        });

        totalSearchCount = filtered.length;

        const start = args.paginationOpts.cursor
          ? Number(args.paginationOpts.cursor)
          : 0;

        const end = start + args.paginationOpts.numItems;
        const page = filtered.slice(start, end);

        result = {
          page,
          isDone: end >= filtered.length,
          continueCursor: end >= filtered.length ? null : String(end),
        };
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

      const enrichedPage = await Promise.all(
        result.page.map(async (user) => {
          const [department, position] = await Promise.all([
            user.departmentId ? ctx.db.get(user.departmentId) : null,
            user.positionId ? ctx.db.get(user.positionId) : null,
          ]);

          return {
            ...user,
            departmentName: department?.name ?? undefined,
            positionName: position?.name ?? undefined,
          };
        }),
      );

      return {
        ...result,
        page: enrichedPage,
        totalUserCount,
        totalSearchCount,
      };
    } catch (error) {
      throw new Error("Unable to load users.");
    }
  },
});

export const updateUserStatus = mutation({
  args: {
    userId: v.id("userProfiles"),
    status: v.union(
      v.literal("active"),
      v.literal("suspended"),
      v.literal("archived"),
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new Error("User not found.");
    }

    if (user.status === args.status) {
      return {
        success: true,
        message: `User is already ${args.status}.`,
      };
    }

    await ctx.db.patch(args.userId, {
      status: args.status,
      updatedAt: new Date().toISOString(),
    });

    return {
      success: true,
      message: `User status updated to ${args.status}`,
    };
  },
});

export const getProfileByID = query({
  args: {
    userProfileId: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      return await ctx.db.get(args.userProfileId as Id<"userProfiles">);
    } catch {
      return null;
    }
  },
});

export const updateUserProfile = mutation({
  args: {
    userId: v.string(),

    employeeId: v.optional(v.string()),
    email: v.optional(v.string()),

    firstName: v.optional(v.string()),
    middleName: v.optional(v.string()),
    lastName: v.optional(v.string()),
    suffix: v.optional(v.string()),

    gender: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    dateOfBirth: v.optional(v.string()),
    hireDate: v.optional(v.string()),

    departmentId: v.optional(v.string()),
    positionId: v.optional(v.string()),

    role: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("suspended"))),
  },

  handler: async (ctx, args) => {
    const { userId, ...changes } = args;

    const existingUser = await ctx.db.get(userId as Id<"userProfiles">);

    if (!existingUser) {
      throw new Error("User profile not found.");
    }

    const patchData: Record<string, any> = {
      ...changes,
      updatedAt: new Date().toISOString(),
    };

    await ctx.db.patch(userId as Id<"userProfiles">, patchData);

    return {
      success: true,
      message: "User profile updated successfully.",
    };
  },
});
