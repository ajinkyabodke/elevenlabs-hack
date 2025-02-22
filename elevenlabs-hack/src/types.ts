export interface JournalEntry {
  id: number;
  rawEntry: string;
  summarizedEntry: string;
  moodScore: string;
  createdAt: string | Date;
}
