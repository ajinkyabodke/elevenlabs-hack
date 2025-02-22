import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
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
    const body = (await req.json()) as JournalEntryInput;
    const { rawEntry } = journalEntrySchema.parse(body);

    if (!rawEntry.trim()) {
      return Response.json(
        { error: "Journal entry is required" },
        { status: 400 },
      );
    }

    // Analyze the entry using Vercel AI SDK
    const { object: analysis } = await generateObject({
      model: openai("gpt-3.5-turbo-0125"),
      schema: journalAnalysisSchema,
      prompt: `Analyze this conversation and provide a summary and mood score:\n\n${rawEntry}`,
      system:
        "You are an expert at analyzing conversations and determining emotional states. Be concise but insightful in your analysis.",
      temperature: 0.7,
      maxTokens: 500,
    });

    // Save to database with the analysis
    const entries = await db
      .insert(journalEntries)
      .values({
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
