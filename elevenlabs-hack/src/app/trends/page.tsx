import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/server/db";
import { journalEntries } from "@/server/db/schema";
import { desc } from "drizzle-orm";

export default async function TrendsPage() {
  const entries = await db.query.journalEntries.findMany({
    orderBy: [desc(journalEntries.createdAt)],
    limit: 50,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Mood Trends</h1>
        <p className="text-lg text-muted-foreground">
          Track your emotional well-being over time
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Mood Score History</CardTitle>
            <CardDescription>Your emotional journey over time</CardDescription>
          </CardHeader>
          <CardContent className="h-[400px]">
            {/* TODO: Add chart component */}
            <div className="flex h-full items-center justify-center text-muted-foreground">
              Chart coming soon...
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Entries</CardTitle>
            <CardDescription>
              Your latest journal entries and their mood scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between border-b pb-4 last:border-0"
                >
                  <div>
                    <p className="font-medium">
                      {new Date(entry.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {entry.summarizedEntry}
                    </p>
                  </div>
                  <div className="text-sm">Score: {entry.moodScore}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
