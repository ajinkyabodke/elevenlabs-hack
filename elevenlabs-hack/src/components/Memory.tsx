"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function Memory() {
  const { data: userData, isLoading } = api.user.getMemory.useQuery();
  const [memories, setMemories] = useState<string[]>(userData ?? []);
  const [newMemory, setNewMemory] = useState("");

  const { mutateAsync: updateMemories, isPending: isUpdatingMemories } =
    api.user.updateMemories.useMutation({
      onSuccess: () => {
        toast.success("Memory saved");
      },
      onError: () => {
        toast.error("Failed to save memory");
      },
    });

  const handleAddMemory = () => {
    if (!newMemory.trim()) return;

    const updatedMemories = [...memories, newMemory.trim()];
    setMemories(updatedMemories);
    setNewMemory("");

    void updateMemories({ memories: updatedMemories });
  };

  const handleDeleteMemory = (index: number) => {
    const updatedMemories = memories.filter((_, i) => i !== index);
    setMemories(updatedMemories);
    void updateMemories({ memories: updatedMemories });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Add new memory input */}
      <div className="flex gap-2">
        <Input
          placeholder="Add a new memory..."
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleAddMemory();
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={handleAddMemory}
          disabled={!newMemory.trim() || isUpdatingMemories}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Memory list */}
      <div className="space-y-2">
        {memories.map((memory, index) => (
          <div
            key={index}
            className={cn(
              "group flex items-center gap-2 rounded-lg border bg-card p-4 transition-all",
              "hover:border-primary/20 hover:shadow-sm",
            )}
          >
            <span className="flex-1 text-sm">{memory}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleDeleteMemory(index)}
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}

        {memories.length === 0 && (
          <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No memories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
