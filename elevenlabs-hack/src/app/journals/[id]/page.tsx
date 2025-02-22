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
import { ArrowLeft, CheckCircle2 } from "lucide-react";
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
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/journals">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Journal Entry</h1>
          <p className="text-sm text-muted-foreground">
            {format(new Date(entry.createdAt), "MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Mood Score Card */}
        <Card className="flex flex-col md:h-[250px]">
          <CardHeader>
            <CardTitle>Current Mood</CardTitle>
            <CardDescription>How you were feeling at the time</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-1 items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-7xl">{moodEmoji}</span>
              <p className={`text-3xl font-bold ${moodColor}`}>
                {moodScore.toFixed(1)}
              </p>
              <p className="text-sm text-muted-foreground">{moodDescription}</p>
            </div>
          </CardContent>
        </Card>

        {/* Key Insights Card */}
        <Card className="flex flex-col md:h-[250px]">
          <CardHeader>
            <CardTitle>Key Insights</CardTitle>
            <CardDescription>
              Important points from your journal entry
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            <ul className="space-y-2">
              {keyInsights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Journal Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Journal Entry</CardTitle>
          <CardDescription>Your thoughts and reflections</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap text-lg leading-relaxed">
            {entry.summarizedEntry}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
