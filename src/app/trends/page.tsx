import { getJournalEntries } from "@/app/_actions/journal";
import { TrendsCharts } from "@/components/TrendsCharts";
import { auth } from "@clerk/nextjs/server";
import { LineChart } from "lucide-react";
import { redirect } from "next/navigation";
export default async function TrendsPage() {
  const session = await auth();

  if (!session.userId) {
    redirect("/");
  }

  const entries = await getJournalEntries(session.userId);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <LineChart className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">Mood Analysis</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Track your emotional well-being over time.
        </p>
      </div>

      <TrendsCharts entries={entries} />
    </div>
  );
}
