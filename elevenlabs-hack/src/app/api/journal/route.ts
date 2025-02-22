import { db } from "@/server/db";
import { journalEntries, users, type UserSelect } from "@/server/db/schema";
import { openai } from "@ai-sdk/openai";
import { auth, currentUser } from "@clerk/nextjs/server";

import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

const journalAnalysisSchema = z.object({
  summary: z
    .string()
    .describe("A brief 1-2 sentence summary of the conversation"),
  moodScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      "A number between 0-100 representing the emotional state: 0-20 (very negative), 21-40 (negative), 41-60 (neutral), 61-80 (positive), 81-100 (very positive)",
    ),
});

const journalEntrySchema = z.object({
  rawEntry: z.string().min(1),
});

type JournalEntryInput = z.infer<typeof journalEntrySchema>;

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const [_user] = await Promise.all([currentUser(), ,]);

    if (!_user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }
    const primaryEmail = _user?.emailAddresses[0]?.emailAddress ?? "";
    const userName = _user?.fullName ?? "User";

    let existingUser = await db.query.users.findFirst({
      where: (u, { eq }) => eq(u.id, userId),
      columns: {
        id: true,
        memory: true,
        memoryEnabledAt: true,
      },
    });

    if (!existingUser) {
      [existingUser] = await db
        .insert(users)
        .values({
          id: userId,
          email: primaryEmail,
          memory: [`User's name is ${userName}.`],
        })
        .returning();
    }

    if (!existingUser) throw new Error("User not found");

    const body = (await req.json()) as JournalEntryInput;
    const { rawEntry } = journalEntrySchema.parse(body);

    if (!rawEntry.trim()) {
      return Response.json(
        { error: "Journal entry is required" },
        { status: 400 },
      );
    }

    const [analysis, memories] = await Promise.all([
      summariseJournalEntry(rawEntry),
      addMemories({
        conversation: rawEntry,
        user: existingUser,
      }),
    ]);

    // Save to database with the analysis and user ID
    const entries = await db
      .insert(journalEntries)
      .values({
        userId,
        rawEntry,
        summarizedEntry: analysis.summary,
        moodScore: analysis.moodScore.toFixed(2),
      })
      .returning();

    const entry = entries[0];
    if (!entry) {
      throw new Error("Failed to create journal entry");
    }

    return Response.json(entry);
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return Response.json(
      { error: "Failed to create journal entry" },
      { status: 500 },
    );
  }
}

const summariseJournalEntry = async (entry: string) => {
  // Analyze the entry using Vercel AI SDK
  const { object: analysis } = await generateObject({
    model: openai("gpt-4o-mini"),
    schema: journalAnalysisSchema,
    prompt: `Analyze this conversation and provide a summary and mood score:\n\n${entry}`,
    system:
      "You are an expert at analyzing conversations and determining emotional states. Be concise but insightful in your analysis.",
    temperature: 0.7,
    maxTokens: 500,
  });

  return analysis;
};

const addMemories = async (props: {
  conversation: string;
  user: Pick<UserSelect, "id" | "memory">;
}) => {
  const { object } = await generateObject({
    model: openai("gpt-4o-mini"),
    prompt: [
      `Today is ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}.`,

      props.user.memory.length > 0 &&
        `Existing memories in user's journal: ${props.user.memory
          .map((m, idx) => `- ${idx + 1}. ${m}`)
          .join("\n")}`,

      `Extract new memories from the following conversation that are not already in the user's journal.

Include only the most significant events in the user's life like the user saying getting a new job, getting married, or having a child.

Conversation:
${props.conversation}

Don't include any memories that are already in the user's journal.
Always include absolute dates, and not "last week" or "last month" etc.`,
    ].join("\n"),
    schema: z.object({
      memories: z.array(z.string()).describe("A list of memories"),
    }),
  });

  const memories = object.memories;

  await db
    .update(users)
    .set({
      memory: [...props.user.memory, ...memories],
    })
    .where(eq(users.id, props.user.id));

  return memories;
};
