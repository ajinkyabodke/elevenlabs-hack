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
import { ArrowLeft } from "lucide-react";
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

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              AI-generated summary of your entry
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-lg">{entry.summarizedEntry}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Full Entry</CardTitle>
            <CardDescription>Your complete journal entry</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap">{entry.rawEntry}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Score</CardTitle>
            <CardDescription>How you were feeling at the time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <span className="text-6xl">{moodEmoji}</span>
              <div>
                <p className={`text-2xl font-bold ${moodColor}`}>
                  {moodScore.toFixed(1)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {moodScore >= 75
                    ? "Excellent mood"
                    : moodScore >= 50
                      ? "Good mood"
                      : moodScore >= 25
                        ? "Fair mood"
                        : "Poor mood"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
