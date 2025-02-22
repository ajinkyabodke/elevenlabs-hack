import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getPromptAttributes: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.userId),
      columns: {
        memory: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    const last7DaysJournalEntries = await ctx.db.query.journalEntries.findMany({
      where: (j, { and, gte }) =>
        and(gte(j.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))),

      columns: {
        moodScore: true,
        createdAt: true,
      },

      limit: 7,

      orderBy: (j, { desc }) => [desc(j.createdAt)],
    });

    const moodScoresWithDays = last7DaysJournalEntries.map((entry) => ({
      moodScore: entry.moodScore,
      day: new Date(entry.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        weekday: "long",
      }),
    }));

    console.log(`moodScoresWithDays`, moodScoresWithDays);

    return {
      memory: user.memory,
      moodScoresWithDays,
    };
  }),
});
