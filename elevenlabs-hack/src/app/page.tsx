import { VoiceJournal } from "@/components/VoiceJournal";

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-2rem)] flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-4 text-center">
        <h1 className="text-4xl font-bold">Voice Journal</h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Express yourself naturally through voice. Our AI will help you track
          your emotional well-being over time.
        </p>
      </div>

      <VoiceJournal />
    </div>
  );
}
