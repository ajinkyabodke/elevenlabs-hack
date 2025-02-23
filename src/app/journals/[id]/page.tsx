import { getJournalEntry } from "@/app/_actions/journal";
import { notFound } from "next/navigation";
import JournalEntryClient from "./client";

interface JournalEntryPageProps {
  params: {
    id: string;
  };
}

export default async function JournalEntryPage({
  params,
}: JournalEntryPageProps) {
  const entry = await getJournalEntry(Number(params.id));
  if (!entry) notFound();
  return <JournalEntryClient entry={entry} />;
}
