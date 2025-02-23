import { Memory } from "@/components/Memory";
import { Brain } from "lucide-react";
export default function MemoryPage() {
  return (
    <main className="relative mx-auto flex flex-col">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold tracking-tight">
            Long Term Memory
          </h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Important memories to personalize your experience with our journalling
          agent.
        </p>
      </div>

      <div className="mt-4 rounded-lg p-2">
        <Memory />
      </div>
    </main>
  );
}
