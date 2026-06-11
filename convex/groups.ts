import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { GROUP_TYPES } from "../lib/constants/group";
import { Id } from "./_generated/dataModel";
import { COLOR_TYPES } from "../lib/constants/color";

export const createGroup = mutation({
  args: {
    name: v.string(),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.union(...GROUP_TYPES.map((type) => v.literal(type))),
    color: v.union(...COLOR_TYPES.map((type) => v.literal(type))),
  },
  handler: async (ctx, args) => {
    const newItem = await ctx.db.insert("groups", {
      name: args.name,
      code: args.code,
      description: args.description,
      type: args.type,
      color: args.color,
      memberCount: 0,
      archived: false,
      isAssignable: true,
      updatedAt: Date.now(),
    });

    return newItem;
  },
});

export const getGroups = query({
  args: {
    paginationOpts: v.object({
      numItems: v.number(),
      cursor: v.union(v.string(), v.null()),
    }),

    search: v.optional(v.string()),
    type: v.optional(v.union(...GROUP_TYPES.map((type) => v.literal(type)))),
  },
  handler: async (ctx, args) => {
    try {
      let result;
      let totalSearchCount: number | undefined;

      const groups = await ctx.db
        .query("groups")
        .withIndex("by_archived", (q) => q.eq("archived", false))
        .collect();

      if (args.search) {
        const search = args.search.toLowerCase();

        const searchResults = await ctx.db
          .query("groups")
          .withSearchIndex("search_groups", (q) => q.search("name", search))
          .collect();

        const filtered = searchResults.filter((item) => {
          if (item.archived) return false;
          if (args.type && item.type !== args.type) return false;
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
        let query = ctx.db.query("groups");

        if (args.type) {
          result = await query
            .withIndex("by_archived_type", (q) =>
              q.eq("archived", false).eq("type", args.type!),
            )
            .paginate(args.paginationOpts);
        } else {
          result = await query.paginate(args.paginationOpts);
        }
      }

      return {
        ...result,
        totalGroupCount: groups.length,
        totalSearchCount: totalSearchCount,
      };
    } catch (error) {
      throw new Error("Unable to load groups.");
    }
  },
});

export const getGroupByID = query({
  args: {
    id: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      return await ctx.db.get(args.id as Id<"groups">);
    } catch {
      return null;
    }
  },
});

export const updateGroup = mutation({
  args: {
    id: v.string(),
    name: v.optional(v.string()),
    code: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.union(...GROUP_TYPES.map((type) => v.literal(type)))),
    color: v.optional(v.union(...COLOR_TYPES.map((type) => v.literal(type)))),
    isAssignable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    try {
      const { id, ...changes } = args;
      const itemId = id as Id<"groups">;
      const item = await ctx.db.get(itemId);

      if (!item) throw new Error("Group cannot be found.");

      const patchData: Record<string, any> = {
        ...changes,
        updatedAt: Date.now(),
      };

      await ctx.db.patch(itemId, patchData);

      return {
        success: true,
        message: "Group information updated successfully.",
      };
    } catch (error) {
      throw new Error("Something went wrong. Unable to update group.");
    }
  },
});

export const updateArchiveStatus = mutation({
  args: {
    id: v.id("groups"),
    status: v.boolean(),
  },
  handler: async (ctx, args) => {
    const group = await ctx.db.get(args.id);

    if (!group) throw new Error("Group not found.");

    await ctx.db.patch(args.id, {
      archived: args.status,
      updatedAt: Date.now(),
    });

    return {
      success: true,
      message: args.status
        ? `${group.name} is successfully archived.`
        : `${group.name} is successfully restored`,
    };
  },
});
