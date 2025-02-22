import { getJournalEntry } from "@/app/_actions/journal";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { format } from "date-fns";
import { ArrowLeft, LightbulbIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

interface JournalEntryPageProps {
  params: {
    id: string;
  };
}

function getMoodEmoji(score: number) {
  if (score >= 75) return "🌟";
  if (score >= 50) return "😊";
  if (score >= 25) return "😐";
  return "😔";
}

function getMoodColor(score: number) {
  if (score >= 75) return "text-green-500";
  if (score >= 50) return "text-blue-500";
  if (score >= 25) return "text-orange-500";
  return "text-red-500";
}

function getMoodDescription(score: number) {
  if (score >= 75) return "Excellent mood";
  if (score >= 50) return "Good mood";
  if (score >= 25) return "Fair mood";
  return "Poor mood";
}

export default async function JournalEntryPage({
  params,
}: JournalEntryPageProps) {
  const entry = await getJournalEntry(Number(params.id));

  if (!entry) {
    notFound();
  }

  const moodScore = parseFloat(entry.moodScore);
  const moodEmoji = getMoodEmoji(moodScore);
  const moodColor = getMoodColor(moodScore);
  const moodDescription = getMoodDescription(moodScore);

  // Convert the summarizedEntry string into a list by splitting on periods
  const keyInsights = entry.summarizedEntry
    .split(".")
    .map((insight) => insight.trim())
    .filter((insight) => insight.length > 0);

  return (
    <div className="space-y-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
        <div className="flex flex-col space-y-4 p-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/journals">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold">Journal Entry</h1>
              <div className="mt-1 flex items-center gap-3">
                <p className="text-sm text-muted-foreground">
                  {format(
                    new Date(entry.createdAt),
                    "MMMM d, yyyy 'at' h:mm a",
                  )}
                </p>
                <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                  <span className="text-xl">{moodEmoji}</span>
                  <span className={`font-medium ${moodColor}`}>
                    {moodScore.toFixed(1)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {moodDescription}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Key Insights Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <LightbulbIcon className="h-5 w-5 text-yellow-500" />
              <CardTitle>Key Insights</CardTitle>
            </div>
            <CardDescription>
              Important points from your journal entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-4 sm:grid-cols-2">
              {keyInsights.map((insight, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-relaxed">{insight}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Journal Summary Card */}
        <Card>
          <CardHeader>
            <CardTitle>Journal Entry</CardTitle>
            <CardDescription>Your thoughts and reflections</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-zinc dark:prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{entry.summarizedEntry}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
