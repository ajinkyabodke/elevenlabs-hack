"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function JournalEntry() {
  const [entry, setEntry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!entry.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawEntry: entry }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit journal entry");
      }

      await response.json();
      toast.success("Entry submitted!", {
        description: "Your journal entry has been processed and saved.",
      });
      setEntry("");
    } catch (error) {
      console.error("Failed to submit entry:", error);
      toast.error("Failed to submit journal entry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>How was your day?</CardTitle>
        <CardDescription>
          Share your thoughts and feelings. Your entry will be analyzed for
          sentiment and summarized.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Today was..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[200px] resize-none"
          disabled={isSubmitting}
        />
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {entry.length} characters
        </p>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting || !entry.trim()}
          className="min-w-[120px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing
            </>
          ) : (
            "Submit Entry"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
