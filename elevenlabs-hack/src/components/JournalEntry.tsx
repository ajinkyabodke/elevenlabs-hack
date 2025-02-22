"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
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
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Tell me about your day..."
          value={entry}
          onChange={(e) => setEntry(e.target.value)}
          className="min-h-[150px]"
        />
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleSubmit} disabled={isSubmitting || !entry.trim()}>
          {isSubmitting ? "Processing..." : "Submit Entry"}
        </Button>
      </CardFooter>
    </Card>
  );
}
