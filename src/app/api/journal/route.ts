import { db } from "@/server/db";
import { journalEntries, users, type UserSelect } from "@/server/db/schema";
import { openai } from "@ai-sdk/openai";
import { auth, currentUser } from "@clerk/nextjs/server";

import { generateObject } from "ai";
import { eq } from "drizzle-orm";
import { z } from "zod";

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
        title: analysis.title,
        moodScore: analysis.moodScore.toFixed(2),
        significantEvents: analysis.significantEvents,
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

// job phone car marriage laptop

const summariseJournalEntry = async (entry: string) => {
  // Analyze the entry using Vercel AI SDK
  const { object: analysis } = await generateObject({
    model: openai("gpt-4o"),
    schema: z.object({
      moodScore: z
        .number()
        .min(0)
        .max(100)
        .describe(
          "A number between 0-100 representing the emotional state: 0-20 (very negative), 21-40 (negative), 41-60 (neutral), 61-80 (positive), 81-100 (very positive)",
        ),
      summary: z
        .string()
        .describe(
          "A simple, natural journal entry written in first person, as if written by the user themselves. Dont make it too concise. It's not actually a summary. It's just a rewrite of the conversation to make it sound like a diary entry. Try to include as much as possible from the conversation.",
        ),
      title: z
        .string()
        .describe("A short title for the journal entry. Max 15-20 words."),
      significantEvents: z
        .array(z.string())
        .describe(
          "A list of significant events that happened in the conversation. It has to be actually signicant. Max 4-5 words for each event. Don't include conjunctions like 'and', 'a' or 'but'. Dont add any significant events if its not there in that session. Dont give more than 1/2 for each session. MAX 2. itll mostly be just 1. Make sure they are happy significant events",
        )
        .max(4),
    }),
    prompt: `Transform this conversation into a simple, natural journal entry. Write it exactly how someone would write in their personal diary - casual, honest, and straightforward.

Conversation transcript:
${entry}

Guidelines:
1. Use simple, everyday language
2. Write in first person, present tense
3. Focus on feelings and thoughts
4. Keep it brief and natural
5. Remove all AI interactions
6. Write as if you're writing in a personal diary

Example style:
"I'm feeling down today. Work was really stressful and I couldn't focus. My mind kept wandering to the argument I had with Sarah. I just need some time to process everything."`,
    system: `You are helping someone write in their personal diary. Write exactly how they would write - simple, honest, and natural. No fancy words, no complex analysis. Just their thoughts and feelings in their own voice.

Remember:
- Write like you're writing in a diary
- Use everyday language
- Keep it short and simple
- Focus on their feelings
- Remove any trace of AI conversation`,
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
