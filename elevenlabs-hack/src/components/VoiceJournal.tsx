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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Mic, MicOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MOODS = [
  { id: "vent", label: "I need to vent", description: "Let it all out" },
  { id: "chat", label: "Just chat", description: "Have a casual conversation" },
  { id: "unwind", label: "Help me unwind", description: "Relax and reflect" },
] as const;

export function VoiceJournal() {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string>("");

  const toggleRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      setIsProcessing(true);
      // TODO: Stop recording and process audio
      setTimeout(() => {
        setIsProcessing(false);
        toast.success("Journal entry saved!");
      }, 2000);
    } else {
      if (!selectedMood) {
        toast.error("Please select how you're feeling first");
        return;
      }
      setIsRecording(true);
      // TODO: Start recording
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-center">Voice Journal</CardTitle>
        <CardDescription className="text-center">
          Select how you're feeling and start talking
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Select value={selectedMood} onValueChange={setSelectedMood}>
          <SelectTrigger>
            <SelectValue placeholder="How are you feeling today?" />
          </SelectTrigger>
          <SelectContent>
            {MOODS.map((mood) => (
              <SelectItem
                key={mood.id}
                value={mood.id}
                className="flex flex-col items-start py-3"
              >
                <div className="text-sm font-medium">{mood.label}</div>
                <div className="text-xs text-muted-foreground">
                  {mood.description}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className={`h-24 w-24 rounded-full ${
              isRecording ? "bg-red-500 hover:bg-red-600" : ""
            }`}
            onClick={toggleRecording}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <Loader2 className="h-12 w-12 animate-spin" />
            ) : isRecording ? (
              <MicOff className="h-12 w-12" />
            ) : (
              <Mic className="h-12 w-12" />
            )}
          </Button>
          <p className="text-sm text-muted-foreground">
            {isProcessing
              ? "Processing your entry..."
              : isRecording
                ? "Recording... Tap to stop"
                : "Tap to start recording"}
          </p>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        {isRecording && (
          <div className="h-2 w-full max-w-[200px] animate-pulse rounded-full bg-red-500" />
        )}
      </CardFooter>
    </Card>
  );
}
