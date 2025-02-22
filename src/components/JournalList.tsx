import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { type JournalEntry } from "@/types";
import { formatDistanceToNow } from "date-fns";

interface JournalListProps {
  entries: JournalEntry[];
}

export function JournalList({ entries }: JournalListProps) {
  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>History</CardTitle>
        <CardDescription>Your journal history and reflections</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {entries.map((entry) => (
              <Card key={entry.id} className="border-l-4 border-l-primary">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">
                      {formatDistanceToNow(new Date(entry.createdAt), {
                        addSuffix: true,
                      })}
                    </CardTitle>
                    <span className="text-sm text-muted-foreground">
                      Mood Score: {entry.moodScore}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground">Summary</p>
                  <p className="text-sm">{entry.summarizedEntry}</p>
                  <p className="mt-4 text-sm text-muted-foreground">
                    Original Entry
                  </p>
                  <p className="text-sm">{entry.rawEntry}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
