import { JournalEntry } from "@/components/JournalEntry";

export default async function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex min-h-screen flex-col items-center gap-8 py-8">
        <h1 className="text-4xl font-bold">Daily Journal</h1>
        <JournalEntry />
      </div>
    </main>
  );
}
