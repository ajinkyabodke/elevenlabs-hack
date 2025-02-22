"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import { LucidePlusCircle, LucideTrash2 } from "lucide-react";
import { Fragment, useState } from "react";
import { toast } from "sonner";

const placeholderMemory = "Enter a memory...";

const VariableInput = ({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) => {
  return (
    <div className="group flex h-12 w-full items-center gap-2 rounded-lg border border-transparent bg-white px-4 shadow-sm transition-all hover:border-primary/20 hover:shadow-md">
      <input
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholderMemory}
        className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground/60"
      />
    </div>
  );
};

export function Memory() {
  const { data: userData, isLoading } = api.user.getMemory.useQuery();
  const [memories, setMemories] = useState<string[]>(userData ?? []);

  const removeEmptyMemories = () => {
    const newMemories = memories.filter((m) => m.trim().length > 0);
    setMemories(newMemories);
    return newMemories;
  };

  const { mutateAsync: updateMemories, isPending: isUpdatingMemories } =
    api.user.updateMemories.useMutation({
      onSuccess: () => {
        toast.success("Memories updated successfully!");
      },
      onError: () => {
        toast.error("Failed to update memories");
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
    <div className="space-y-6 p-4">
      <div className="flex flex-col gap-3">
        {memories.map((memory, idx) => (
          <Fragment key={idx}>
            <div className="group flex w-full items-center gap-3">
              <VariableInput
                value={memory}
                onValueChange={(newValue) => {
                  const newMemories = [...memories];
                  newMemories[idx] = newValue;
                  setMemories(newMemories);
                }}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setMemories(memories.filter((_, i) => i !== idx));
                }}
                className="h-9 w-9 shrink-0 text-muted-foreground/60 hover:text-destructive"
              >
                <LucideTrash2 className="h-4 w-4" />
              </Button>
            </div>
          </Fragment>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setMemories([...memories, ""])}
          disabled={isUpdatingMemories}
          className="flex items-center gap-2"
        >
          <LucidePlusCircle className="h-4 w-4" />
          Add Memory
        </Button>

        <Button
          size="sm"
          disabled={isUpdatingMemories}
          onClick={() => {
            const sanitizedMemories = removeEmptyMemories();
            void updateMemories({
              memories: sanitizedMemories,
            });
          }}
          className="disabled:cursor-progress"
        >
          {isUpdatingMemories ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
