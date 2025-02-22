import { Memory } from "@/components/Memory";

export default function MemoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Memory Bank</h1>
        <p className="text-lg text-muted-foreground">
          Track patterns, triggers, and preferences to better understand
          yourself
        </p>
      </div>

      <Memory />
    </div>
  );
}
