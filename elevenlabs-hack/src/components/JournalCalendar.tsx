"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { type JournalEntry } from "@/types";
import { format, startOfToday } from "date-fns";
import { useState } from "react";

interface JournalCalendarProps {
  entries: JournalEntry[];
}

export function JournalCalendar({ entries }: JournalCalendarProps) {
  const [date, setDate] = useState<Date>(startOfToday());

  // Create a map of dates to entries for quick lookup
  const entriesByDate = entries.reduce(
    (acc, entry) => {
      const date = new Date(entry.createdAt);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!acc[dateKey]) {
        acc[dateKey] = [];
      }
      acc[dateKey].push(entry);
      return acc;
    },
    {} as Record<string, JournalEntry[]>,
  );

  // Function to get entries for a specific date
  const getEntriesForDate = (date: Date) => {
    const dateKey = format(date, "yyyy-MM-dd");
    return entriesByDate[dateKey] ?? [];
  };

  // Function to get mood score color
  const getMoodColor = (score: number) => {
    if (score >= 75) return "bg-green-500";
    if (score >= 50) return "bg-yellow-500";
    if (score >= 25) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={(date) => date && setDate(date)}
        className="mx-auto"
        components={{
          DayContent: ({ date: dayDate }) => {
            const dayEntries = getEntriesForDate(dayDate);
            const hasEntries = dayEntries.length > 0;

            return (
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="relative flex h-9 w-9 items-center justify-center">
                    <span>{format(dayDate, "d")}</span>
                    {hasEntries && (
                      <div className="absolute -bottom-1 flex gap-0.5">
                        {dayEntries.map((entry) => (
                          <div
                            key={entry.id}
                            className={`h-1 w-1 rounded-full ${getMoodColor(
                              parseFloat(entry.moodScore),
                            )}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </HoverCardTrigger>
                {hasEntries && (
                  <HoverCardContent className="w-80" align="start" side="right">
                    <div className="space-y-2">
                      <p className="text-sm font-medium">
                        {format(dayDate, "MMMM d, yyyy")}
                      </p>
                      <div className="space-y-4">
                        {dayEntries.map((entry) => (
                          <div key={entry.id} className="space-y-1">
                            <p className="text-sm">{entry.summarizedEntry}</p>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${getMoodColor(
                                  parseFloat(entry.moodScore),
                                )}`}
                              />
                              <span className="text-xs text-muted-foreground">
                                Mood Score: {entry.moodScore}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </HoverCardContent>
                )}
              </HoverCard>
            );
          },
        }}
      />
    </div>
  );
}
