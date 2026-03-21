import { query } from "./_generated/server";

export const getDepartments = query({
  handler: async (ctx) => {
    return await ctx.db.query("departments").withIndex("by_name").collect();
  },
});
