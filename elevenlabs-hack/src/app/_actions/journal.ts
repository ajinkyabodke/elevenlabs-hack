"use server";

import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export async function getJournalEntries() {
  return await db.query.journalEntries.findMany({
    orderBy: [desc(journalEntries.createdAt)],
  });
}
