"use client";

import { EnhancedCalendar } from "@/components/EnhancedCalendar";
import { type JournalEntry, type CalendarEvent } from "@/types";
import { useState } from "react";
import { toast } from "sonner";

interface CalendarWrapperProps {
  entries: JournalEntry[];
  initialEvents?: CalendarEvent[];
}

export function CalendarWrapper({ entries, initialEvents = [] }: CalendarWrapperProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const handleAddEvent = async (event: Omit<CalendarEvent, "id">) => {
    // In a real app, you'd make an API call here
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(), // Temporary ID generation
    };
    
    setEvents((prev) => [...prev, newEvent]);
    
    // Add toast notification
    toast.success("Event added", {
      description: "Your new event has been added to the calendar.",
    });
  };

  const handleEditEvent = async (event: CalendarEvent) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? event : e))
    );
    // You can add a toast notification here
  };

  return (
    <EnhancedCalendar
      entries={entries}
      events={events}
      onAddEvent={handleAddEvent}
      onEditEvent={handleEditEvent}
    />
  );
} 