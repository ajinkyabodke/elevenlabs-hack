import { getJournalEntries } from "@/app/_actions/journal";
import { TrendsCharts } from "@/components/TrendsCharts";
import { LineChart } from "lucide-react";

export default async function TrendsPage() {
  const entries = await getJournalEntries();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <LineChart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Mood Trends</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your emotional well-being over time journalling agent.
        </p>
      </div>

      <TrendsCharts entries={entries} />
    </div>
  );
}
