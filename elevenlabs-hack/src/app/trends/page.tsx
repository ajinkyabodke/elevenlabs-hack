import { getJournalEntries } from "@/app/_actions/journal";
import { TrendsCharts } from "@/components/TrendsCharts";

export default async function TrendsPage() {
  const entries = await getJournalEntries();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Mood Trends</h1>
        <p className="text-lg text-muted-foreground">
          Track your emotional well-being over time
        </p>
      </div>

      <TrendsCharts entries={entries} />
    </div>
  );
}
