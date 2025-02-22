"use server";

import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";

export async function getJournalEntries() {
  return await db.query.journalEntries.findMany({
    orderBy: [desc(journalEntries.createdAt)],
  });
}

export async function getJournalEntry(id: number) {
  const [entry] = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.id, id))
    .limit(1);

  return entry;
}
