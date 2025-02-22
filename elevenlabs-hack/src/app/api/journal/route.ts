import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { NextResponse } from "next/server";
import { z } from "zod";

const journalEntrySchema = z.object({
  rawEntry: z.string().min(1),
});

type JournalEntryInput = z.infer<typeof journalEntrySchema>;

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as JournalEntryInput;
    const { rawEntry } = journalEntrySchema.parse(body);

    if (!rawEntry.trim()) {
      return NextResponse.json(
        { error: "Journal entry is required" },
        { status: 400 },
      );
    }

    // TODO: Use ElevenLabs API to process the entry
    // For now, we'll use a mock summary and score
    const summarizedEntry = `Summary of: ${rawEntry.slice(0, 50)}...`;
    const moodScore = (Math.random() * 100).toFixed(2); // Mock score between 0-100 with 2 decimal places

    const [entry] = await db
      .insert(journalEntries)
      .values({
        rawEntry,
        summarizedEntry,
        moodScore,
      })
      .returning();

    return NextResponse.json(entry);
  } catch (error) {
    console.error("Failed to create journal entry:", error);
    return NextResponse.json(
      { error: "Failed to create journal entry" },
      { status: 500 },
    );
  }
}
