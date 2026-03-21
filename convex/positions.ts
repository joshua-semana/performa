import { query } from "./_generated/server";

export const getPositions = query({
  handler: async (ctx) => {
    return await ctx.db.query("positions").withIndex("by_name").collect();
  },
});
