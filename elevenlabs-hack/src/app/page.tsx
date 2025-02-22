import { JournalEntry } from "@/components/JournalEntry";
import { JournalList } from "@/components/JournalList";
import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export default async function Home() {
  const entries = await db.query.journalEntries.findMany({
    orderBy: [desc(journalEntries.createdAt)],
    limit: 50,
  });

  return (
    <main className="container mx-auto p-4">
      <div className="flex min-h-screen flex-col items-center gap-8 py-8">
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-4xl font-bold">Daily Journal</h1>
          <p className="max-w-xl text-center text-lg text-muted-foreground">
            Record your daily thoughts and feelings. Our AI will analyze your
            entries to help you track your emotional well-being over time.
          </p>
        </div>

        <div className="grid w-full max-w-5xl gap-8">
          <JournalEntry />
          <JournalList entries={entries} />
        </div>
      </div>
    </main>
  );
}
