"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

export function Memory() {
  const { data: userData, isLoading, refetch } = api.user.getMemory.useQuery();
  const [newMemory, setNewMemory] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: updateMemories, isPending: isUpdatingMemories } =
    api.user.updateMemories.useMutation({
      onSuccess: () => {
        setNewMemory("");
        toast.success("Memory saved");
        void refetch();
      },
      onError: () => {
        toast.error("Failed to save memory");
        void refetch();
      },
    });

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
          ref={inputRef}
          placeholder="Add a new memory..."
          value={newMemory}
          onChange={(e) => setNewMemory(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (userData) {
                void updateMemories({ memories: [...userData, newMemory] });
              }
            }
          }}
          className="flex-1"
        />
        <Button
          onClick={() => {
            if (userData) {
              void updateMemories({ memories: [...userData, newMemory] });
            }
          }}
          disabled={!newMemory.trim() || isUpdatingMemories}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>

      {/* Memory list */}
      <div className="flex flex-col-reverse space-y-2">
        {userData?.map((memory, index) => (
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
              onClick={() => {
                if (userData) {
                  void updateMemories({
                    memories: userData.filter((_, i) => i !== index),
                  });
                }
              }}
              className="h-8 w-8 opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
            </Button>
          </div>
        ))}

        {userData?.length === 0 && (
          <div className="flex min-h-[100px] items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-muted-foreground">No memories yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
