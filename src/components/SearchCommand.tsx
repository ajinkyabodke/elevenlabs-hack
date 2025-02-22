"use client";

import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { type JournalEntry } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchCommandProps {
  entries: JournalEntry[];
}

export function SearchCommand({ entries }: SearchCommandProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className="relative h-9 w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
        onClick={() => setOpen(true)}
      >
        <span className="hidden lg:inline-flex">Search journal entries...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search all journal entries..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {entries.map((entry) => (
              <CommandItem
                key={entry.id}
                value={`${entry.summarizedEntry} ${entry.rawEntry}`}
                className="flex flex-col items-start gap-2"
                onSelect={() => {
                  router.push(`/journals/${entry.id}`);
                  setOpen(false);
                }}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="font-medium">{entry.summarizedEntry}</span>
                  <span className="text-sm text-muted-foreground">
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
