"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { type CalendarEvent, type JournalEntry } from "@/types";
import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
  subDays,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

interface EnhancedCalendarProps {
  events: CalendarEvent[];
  entries: JournalEntry[];
  onAddEvent?: (event: Omit<CalendarEvent, "id">) => void;
  onEditEvent?: (event: CalendarEvent) => void;
}

export function EnhancedCalendar({
  events,
  entries,
  onAddEvent,
  onEditEvent,
}: EnhancedCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<"week" | "month">("month");

  // Get mood emoji based on score
  const getMoodEmoji = (score: number) => {
    if (score >= 75) return "🌟";
    if (score >= 50) return "😊";
    if (score >= 25) return "😐";
    return "😔";
  };

  const getMoodColor = (score: number) => {
    if (score >= 75) return "text-green-700 dark:text-green-400";
    if (score >= 50) return "text-yellow-700 dark:text-yellow-400";
    if (score >= 25) return "text-orange-700 dark:text-orange-400";
    return "text-red-700 dark:text-red-400";
  };

  // Add this function to calculate average mood score
  const getAverageMoodScore = (entries: JournalEntry[]) => {
    if (entries.length === 0) return 0;
    const sum = entries.reduce(
      (acc, entry) => acc + parseFloat(entry.moodScore),
      0,
    );
    return sum / entries.length;
  };

  // Add this function to get a color for each event
  const getEventColor = (index: number) => {
    const colors = [
      "bg-blue-100 dark:bg-blue-900/30",
      "bg-green-100 dark:bg-green-900/30",
      "bg-purple-100 dark:bg-purple-900/30",
      "bg-orange-100 dark:bg-orange-900/30",
      "bg-pink-100 dark:bg-pink-900/30",
    ];
    return colors[index % colors.length];
  };

  // Combine events and entries for a given date
  const getDayContent = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayEvents = events.filter(
      (event) => format(event.date, "yyyy-MM-dd") === dateStr,
    );
    const dayEntries = entries.filter(
      (entry) => format(new Date(entry.createdAt), "yyyy-MM-dd") === dateStr,
    );

    return { events: dayEvents, entries: dayEntries };
  };

  // Generate calendar days based on view
  const calendarDays = useMemo(() => {
    if (view === "week") {
      return Array.from({ length: 7 }, (_, i) => {
        const start = startOfWeek(currentDate, { weekStartsOn: 1 });
        return addDays(start, i);
      });
    } else {
      const start = startOfMonth(currentDate);
      const end = endOfMonth(currentDate);
      const daysInMonth = eachDayOfInterval({ start, end });

      // Add days from previous month to start on Monday
      const startDay = getDay(start);
      const prevDays =
        startDay > 0
          ? Array.from({ length: startDay - 1 }, (_, i) =>
              subDays(start, startDay - 1 - i),
            )
          : [];

      // Add days from next month to complete the grid
      const endDay = getDay(end);
      const nextDays =
        endDay < 6
          ? Array.from({ length: 7 - endDay }, (_, i) => addDays(end, i + 1))
          : [];

      return [...prevDays, ...daysInMonth, ...nextDays];
    }
  }, [currentDate, view]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (view === "week") {
                setCurrentDate(addDays(currentDate, -7));
              } else {
                setCurrentDate(addMonths(currentDate, -1));
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              if (view === "week") {
                setCurrentDate(addDays(currentDate, 7));
              } else {
                setCurrentDate(addMonths(currentDate, 1));
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={view === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("week")}
          >
            Week
          </Button>
          <Button
            variant={view === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setView("month")}
          >
            Month
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className={cn(
          "grid gap-px bg-muted",
          view === "week" ? "grid-cols-7" : "grid-cols-7",
        )}
      >
        {/* Weekday Headers */}
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="bg-background p-2 text-center text-sm font-medium"
          >
            {day}
          </div>
        ))}

        {/* Calendar Days */}
        {calendarDays.map((date) => {
          const { events: dayEvents, entries: dayEntries } =
            getDayContent(date);
          const isToday = isSameDay(date, new Date());
          const isCurrentMonth = isSameMonth(date, currentDate);

          return (
            <div
              key={date.toISOString()}
              className={cn(
                "group relative flex min-h-[120px] flex-col bg-background p-2",
                !isCurrentMonth && "text-muted-foreground/50",
                isToday && "bg-accent/50",
              )}
            >
              {/* Header with date and average mood emoji */}
              <div className="flex items-start justify-between">
                <span
                  className={cn(
                    "flex h-6 w-6 items-center justify-center rounded-full text-sm",
                    isToday && "bg-primary font-medium text-primary-foreground",
                    dayEntries.length > 0 &&
                      dayEntries[0]?.id &&
                      "cursor-pointer hover:bg-accent",
                  )}
                >
                  {dayEntries.length > 0 && dayEntries[0]?.id ? (
                    <Link href={`/journals/${dayEntries[0].id}`}>
                      {format(date, "d")}
                    </Link>
                  ) : (
                    format(date, "d")
                  )}
                </span>
                {dayEntries.length > 0 && (
                  <div className="flex items-center justify-center">
                    <span
                      className={cn(
                        "text-lg",
                        getMoodColor(getAverageMoodScore(dayEntries)),
                      )}
                    >
                      {getMoodEmoji(getAverageMoodScore(dayEntries))}
                    </span>
                    {/* {dayEntries.length > 1 && (
                      <span className="ml-1 text-xs text-muted-foreground">
                        ({dayEntries.length})
                      </span>
                    )} */}
                  </div>
                )}
              </div>
              {/* Significant Events */}
              {dayEntries.length > 0 &&
                dayEntries[0]?.significantEvents &&
                dayEntries[0].significantEvents.length > 0 && (
                  <div className="mt-1 space-y-1">
                    {dayEntries[0].significantEvents
                      .slice(0, 3)
                      .map((event, index) => (
                        <div
                          key={index}
                          className={cn(
                            "rounded px-1 py-0.5 text-xs text-muted-foreground",
                            getEventColor(index),
                          )}
                        >
                          {event}
                        </div>
                      ))}
                    {dayEntries[0].significantEvents.length - 3 > 0 &&
                      dayEntries[0].significantEvents.length > 2 && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="text-xs text-muted-foreground">
                              +{dayEntries[0].significantEvents.length - 3} more
                            </TooltipTrigger>
                            <TooltipContent className="flex flex-col gap-y-1 rounded-sm border border-border bg-background p-1 text-foreground">
                              {dayEntries[0].significantEvents.map(
                                (event, index) => (
                                  <div
                                    key={index}
                                    className={cn(
                                      "rounded px-1 py-0.5 text-xs text-muted-foreground",
                                      getEventColor(index),
                                      "w-full",
                                    )}
                                  >
                                    {event}
                                  </div>
                                ),
                              )}
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                  </div>
                )}

              {/* Entry summary */}
              {/* {dayEntries.length > 0 && (
                <div className="mt-1 text-xs text-muted-foreground">
                  {dayEntries[0]?.summarizedEntry}
                </div>
              )} */}

              {/* Events list at bottom */}
              <div className="mt-auto space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className={cn(
                      "truncate rounded px-2 py-1 text-xs font-medium",
                      event.color
                        ? `bg-${event.color}/10 text-${event.color}-700 dark:text-${event.color}-400`
                        : "text-primary-700 dark:text-primary-400 bg-primary/10",
                    )}
                  >
                    {event.title}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Add Event Form Component
function AddEventForm({
  onSubmit,
}: {
  onSubmit?: (event: Omit<CalendarEvent, "id">) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [color, setColor] = useState("#6b8971");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onSubmit) return;

    onSubmit({
      title,
      description,
      date: new Date(date),
      color,
    });

    // Reset form
    setTitle("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setColor("#6b8971");

    // Close the dialog
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
            <DialogDescription>
              Create a new event in your calendar
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <Input
              id="color"
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Event</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
