"use client";

import { BurnEffect } from "@/components/BurnEffect";
import { ToolDialog } from "@/components/ToolDialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { activeToolAtom } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { type JournalEntry } from "@/types";
import { useConversation } from "@11labs/react";
import { useAtom } from "jotai";
import {
  Brain,
  Flame,
  Loader2,
  Mic,
  MicOff,
  Timer,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MOOD_ICONS = [Flame, Brain, Timer] as const;
type MoodIcon = (typeof MOOD_ICONS)[number];

type Mood = {
  id: string;
  label: string;
  description: string;
  icon: MoodIcon;
  prompt: string;
};

const MOODS: Mood[] = [
  {
    id: "vent",
    label: "I need to vent",
    description: "Let it all out",
    icon: MOOD_ICONS[0],
    prompt: "I am here to listen. Tell me what is bothering you...",
  },
  {
    id: "chat",
    label: "Just chat",
    description: "Have a casual conversation",
    icon: MOOD_ICONS[1],
    prompt: "How was your day? I would love to hear about it...",
  },
  {
    id: "unwind",
    label: "Help me unwind",
    description: "Relax and reflect",
    icon: MOOD_ICONS[2],
    prompt: "Let us take a moment to relax. How are you feeling right now?",
  },
];

interface Message {
  source: "user" | "ai";
  message: string;
}

interface ConversationTranscript {
  messages: Message[];
  summary?: string;
}

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [isBurning, setIsBurning] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [, setActiveTool] = useAtom(activeToolAtom);
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast.success("Ready to record");
    },
    onDisconnect: () => {
      console.log("Disconnected from ElevenLabs");
      toast.info("Recording stopped");
    },
    onMessage: async (message: Message) => {
      console.log("Received message:", message);
      setTranscript((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));
    },
    onError: (error: Error) => {
      console.error("Error from ElevenLabs:", error);
      toast.error("Something went wrong with the recording");
    },
    clientTools: {
      start_breathing_exercise: () => {
        setActiveTool("breathing");
      },
      start_grounding_exercise: () => {
        setActiveTool("grounding");
      },
      start_behavioral_activation_quest: () => {
        setActiveTool("behavioral");
      },
      start_progressive_muscle_relaxation: () => {
        setActiveTool("pmr");
      },
    },
  });

  const saveJournalEntry = async () => {
    try {
      console.log("Saving transcript:", transcript);
      const rawEntry = transcript.messages
        .map((msg) => `${msg.source}: ${msg.message}`)
        .join("\n");

      console.log("Formatted entry:", rawEntry);

      const response = await fetch("/api/journal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rawEntry }),
      });

      if (!response.ok) {
        throw new Error("Failed to save journal entry");
      }

      const savedEntry = (await response.json()) as JournalEntry;
      console.log("Saved entry:", savedEntry);
      toast.success("Journal entry saved!");
    } catch (error) {
      console.error("Failed to save journal entry:", error);
      toast.error("Failed to save journal entry");
    }
  };

  const toggleRecording = async () => {
    if (conversation?.status === "connected") {
      console.log("Stopping recording...");
      await conversation.endSession();
      setIsProcessing(true);
      await saveJournalEntry();
      setTranscript({ messages: [] });
      setIsProcessing(false);
    } else {
      if (!selectedMood) {
        toast.error("Please select how you're feeling first");
        return;
      }
      try {
        console.log("Starting recording with mood:", selectedMood);
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "AupMfEyUGwuMVyOywI6b",
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast.error("Failed to start recording");
      }
    }
  };

  const handleBurnEntry = () => {
    if (conversation?.status === "connected") {
      setIsBurning(true);
      void conversation.endSession();
    }
  };

  const handleBurnComplete = () => {
    setIsBurning(false);
    toast.success("Entry burned 🔥", {
      description: "Sometimes it helps just to let it out.",
    });
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <ToolDialog />
      <Card className="relative w-full overflow-hidden border-sage-200 bg-gradient-to-br from-sage-50 to-white shadow-none transition-all hover:border-sage-300 hover:shadow-lg">
        {isBurning && <BurnEffect onComplete={handleBurnComplete} />}
        <CardHeader>
          <CardTitle>Voice Journal</CardTitle>
          <CardDescription>
            Select your mood and start recording your thoughts
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Select value={selectedMood} onValueChange={setSelectedMood}>
            <SelectTrigger>
              <SelectValue placeholder="How are you feeling?" />
            </SelectTrigger>
            <SelectContent>
              {MOODS.map((mood) => (
                <SelectItem key={mood.id} value={mood.id}>
                  <div className="flex items-center gap-2">
                    {mood.icon && (
                      <mood.icon className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{mood.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMood && (
            <p className="text-sm text-muted-foreground">
              {MOODS.find((m) => m.id === selectedMood)?.prompt}
            </p>
          )}

          <div className="flex gap-2">
            <Button
              variant={
                conversation?.status === "connected" ? "destructive" : "default"
              }
              onClick={toggleRecording}
              disabled={isProcessing}
              className="flex-1"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : conversation?.status === "connected" ? (
                <>
                  <MicOff className="mr-2 h-4 w-4" />
                  Stop Recording
                </>
              ) : (
                <>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </>
              )}
            </Button>

            {conversation?.status === "connected" && (
              <Button
                variant="outline"
                size="icon"
                onClick={handleBurnEntry}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {transcript.messages.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Recent Messages</h3>
              <div className="space-y-4 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                {transcript.messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "rounded-lg p-3",
                      msg.source === "user"
                        ? "bg-primary/10 text-primary"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {msg.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
