import { getJournalEntries } from "@/app/_actions/journal";
import { CalendarWrapper } from "@/components/CalendarWrapper";
import { SearchCommand } from "@/components/SearchCommand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, formatDistanceToNow } from "date-fns";
import { ArrowRight, CalendarIcon, ListIcon } from "lucide-react";
import Link from "next/link";

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

export default async function JournalsPage() {
  const entries = await getJournalEntries();

  // Group entries by month
  const entriesByMonth = entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.createdAt);
      const monthKey = date.toLocaleString("default", {
        month: "long",
        year: "numeric",
      });

      if (!acc[monthKey]) {
        acc[monthKey] = [];
      }
      acc[monthKey].push(entry);
      return acc;
    },
    {} as Record<string, typeof entries>,
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Journal Entries</h1>
          <p className="text-lg text-muted-foreground">
            Your journey of thoughts and reflections
          </p>
        </div>
        <SearchCommand entries={entries} />
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <ListIcon className="h-4 w-4" />
            List View
          </TabsTrigger>
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Calendar View
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-8">
          {Object.entries(entriesByMonth).map(([month, monthEntries]) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {month}
                  <span className="text-sm font-normal text-muted-foreground">
                    {monthEntries.length} entries
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4">
                {monthEntries.map((entry) => {
                  const moodScore = parseFloat(entry.moodScore);
                  const moodEmoji = getMoodEmoji(moodScore);
                  const moodColor = getMoodColor(moodScore);
                  const moodDescription = getMoodDescription(moodScore);

                  return (
                    <Link
                      key={entry.id}
                      href={`/journals/${entry.id}`}
                      className="group relative flex items-center gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                    >
                      {/* Date Column */}
                      <div className="flex min-w-[90px] flex-col items-center rounded-md bg-muted p-2 text-center">
                        <span className="text-2xl font-semibold">
                          {format(new Date(entry.createdAt), "d")}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(entry.createdAt), "MMM yyyy")}
                        </span>
                      </div>

                      {/* Content Column */}
                      <div className="flex flex-1 flex-col gap-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium group-hover:underline">
                            {entry.title}
                          </h3>
                          <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-1">
                            <span className="text-base">{moodEmoji}</span>
                            <span
                              className={`text-sm font-medium ${moodColor}`}
                            >
                              {moodScore.toFixed(1)}
                            </span>
                          </div>
                        </div>

                        <p className="line-clamp-2 text-sm text-muted-foreground">
                          {entry.summarizedEntry}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(entry.createdAt), {
                              addSuffix: true,
                            })}
                          </span>
                          <ArrowRight className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View your entries and events in a calendar format. Emojis
                indicate mood scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CalendarWrapper entries={entries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
