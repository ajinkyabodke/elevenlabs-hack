import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const userRouter = createTRPCRouter({
  getPromptAttributes: protectedProcedure.query(async ({ ctx }) => {
    const _user = await currentUser();
    const primaryEmail = _user?.emailAddresses[0]?.emailAddress ?? "";

    let existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.userId),
      columns: {
        id: true,
        memory: true,
        memoryEnabledAt: true,
        details: true,
      },
    });

    if (!existingUser) {
      [existingUser] = await db
        .insert(users)
        .values({
          id: ctx.session.userId,
          email: primaryEmail,
          details: "",
          memory: [`User's name is ${_user?.fullName}.`],
        })
        .returning();
    }

    if (!existingUser) throw new TRPCError({ code: "UNAUTHORIZED" });

    const last7DaysJournalEntries = await ctx.db.query.journalEntries.findMany({
      where: (j, { and, gte }) =>
        and(gte(j.createdAt, new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))),

      columns: {
        moodScore: true,
        createdAt: true,
        significantEvents: true,
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

    const significantEventsWithDays = last7DaysJournalEntries.map((entry) => ({
      significantEvents: entry.significantEvents,
      day: new Date(entry.createdAt).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        weekday: "long",
      }),
    }));

    return {
      memory: existingUser.memory,
      details: existingUser.details ?? "",
      moodScoresWithDays,
      significantEventsWithDays,
    };
  }),

  getMemory: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.userId),
      columns: {
        memory: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return user.memory;
  }),

  updateMemories: protectedProcedure
    .input(
      z.object({
        memories: z.array(z.string()),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { memories } = input;
      await ctx.db
        .update(users)
        .set({ memory: memories })
        .where(eq(users.id, ctx.session.userId));
    }),

  getDetails: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, ctx.session.userId),
      columns: {
        details: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    return user.details ?? "";
  }),

  updateDetails: protectedProcedure
    .input(
      z.object({
        details: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { details } = input;
      await ctx.db
        .update(users)
        .set({ details: details || "" }) // Ensure empty string if falsy
        .where(eq(users.id, ctx.session.userId));
    }),
});
