export interface JournalEntry {
  id: number;
  rawEntry: string;
  summarizedEntry: string;
  moodScore: string;
  significantEvents?: string[] | null;
  createdAt: string | Date;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  type?: string; // Optional event type for different styling
  color?: string; // Optional color for the event
}
