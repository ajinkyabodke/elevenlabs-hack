import { getJournalEntries } from "@/app/_actions/journal";
import { JournalCalendar } from "@/components/JournalCalendar";
import { SearchCommand } from "@/components/SearchCommand";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDistanceToNow } from "date-fns";

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
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-8">
          {Object.entries(entriesByMonth).map(([month, monthEntries]) => (
            <Card key={month}>
              <CardHeader>
                <CardTitle>{month}</CardTitle>
                <CardDescription>{monthEntries.length} entries</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {monthEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="group relative flex items-start gap-4 rounded-lg border p-4 hover:bg-muted/50"
                  >
                    <div className="flex min-w-[100px] flex-col">
                      <span className="text-sm font-medium">
                        {new Date(entry.createdAt).toLocaleDateString(
                          undefined,
                          {
                            day: "numeric",
                            month: "short",
                          },
                        )}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(entry.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>

                    <div className="flex-1 space-y-2">
                      <HoverCard>
                        <HoverCardTrigger asChild>
                          <p className="font-medium">{entry.summarizedEntry}</p>
                        </HoverCardTrigger>
                        <HoverCardContent className="w-80">
                          <div className="space-y-2">
                            <h4 className="text-sm font-semibold">
                              Full Entry
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {entry.rawEntry}
                            </p>
                          </div>
                        </HoverCardContent>
                      </HoverCard>

                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-primary/10 px-2 py-1 text-xs">
                          Mood Score: {entry.moodScore}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
              <CardDescription>
                View your entries in a calendar format. Dots indicate mood
                scores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <JournalCalendar entries={entries} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
