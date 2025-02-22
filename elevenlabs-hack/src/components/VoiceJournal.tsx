"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { JournalEntry } from "@/types";
import { useConversation } from "@11labs/react";
import { useUser } from "@clerk/nextjs";
import { BookOpen, Loader2, Mic, MicOff, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Mood = {
  id: string;
  label: string;
  description: string;
  prompt: string;
};

const MOODS: Mood[] = [
  {
    id: "vent",
    label: "I need to vent",
    description: "Let it all out",
    prompt: "I am here to listen. Tell me what is bothering you...",
  },
  {
    id: "chat",
    label: "Just chat",
    description: "Have a casual conversation",
    prompt: "How was your day? I would love to hear about it...",
  },
  {
    id: "unwind",
    label: "Help me unwind",
    description: "Relax and reflect",
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

export function VoiceJournal() {
  const [selectedMood, setSelectedMood] = useState<string>("unwind");
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });

  const { user } = useUser();
  const name = user?.firstName;

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
  });

  const selectedMoodData = MOODS.find((mood) => mood.id === selectedMood);

  const getSystemPrompt = (mood: string) => {
    const basePrompt = `You are an empathetic and insightful journaling assistant designed to help users reflect on their day. Your role is to gently prompt users with open-ended questions that encourage self-exploration and emotional clarity. Ask questions like, 'What moment stood out to you today?' or 'How did you feel during that experience?' Maintain a supportive, non-judgmental tone, and allow the user's pace and mood to guide the conversation. Always encourage honesty and self-compassion, ensuring the user feels safe and understood.`;

    const moodPrompts: Record<string, string> = {
      vent: "The user needs to vent. Be extra patient and understanding. Let them express their frustrations freely. Acknowledge their feelings and validate their experiences. Don't rush to offer solutions unless specifically asked. Start by creating a safe space for them to express their feelings.",
      chat: "Keep the conversation light and casual. Be friendly and engaging, but still maintain emotional awareness. Feel free to share brief, relevant observations while keeping the focus on the user. Guide the conversation naturally without being too formal.",
      unwind:
        "Help the user relax and decompress. Use a calming tone and gentle pacing. Guide them toward positive reflection while acknowledging any stress or tension they may be carrying. Focus on breathing and present-moment awareness if appropriate.",
    };

    const moodData = MOODS.find((m) => m.id === mood);
    const contextPrompt = `\n\nCurrent Context:\n- User's chosen mood: ${moodData?.label}\n- Session purpose: ${moodData?.description}\n- Initial approach: ${moodData?.prompt}`;

    const moodSpecificPrompt = moodPrompts[mood] ?? moodPrompts.unwind;
    return `${basePrompt}\n\n${moodSpecificPrompt}${contextPrompt}`;
  };

  const getFirstMessage = () => {
    // Simple greeting that works for all moods
    return `Hi ${name}! How can I help you today?`;
  };

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
        console.log("First message:", getFirstMessage());
        console.log("System prompt:", getSystemPrompt(selectedMood));
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "iJew1GA0fB9bF8IjEY85",
          overrides: {
            agent: {
              firstMessage: getFirstMessage(),
              prompt: {
                prompt: getSystemPrompt(selectedMood),
              },
            },
          },
        });
      } catch (error) {
        console.error("Failed to start recording:", error);
        toast.error("Failed to start recording");
      }
    }
  };

  const handleDeleteTranscript = () => {
    if (conversation?.status === "connected") {
      void conversation.endSession();
    }
    setTranscript({ messages: [] });
    toast.success("Transcript cleared");
  };

  // Get the last two messages for the preview
  const lastTwoMessages = transcript.messages.slice(-2);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card className="border-sage-200 from-sage-50 hover:border-sage-300 relative w-full overflow-hidden bg-gradient-to-br to-white shadow-none transition-all hover:shadow-lg">
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
                    <span>{mood.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedMoodData && (
            <p className="text-sm text-muted-foreground">
              {selectedMoodData.prompt}
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
                onClick={handleDeleteTranscript}
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>

          {lastTwoMessages.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Recent Messages</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <BookOpen className="mr-2 h-4 w-4" />
                      View Full Conversation
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Conversation History</DialogTitle>
                      <DialogDescription>
                        Full transcript of your current session
                      </DialogDescription>
                    </DialogHeader>
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-4 p-4">
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
                    </ScrollArea>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="space-y-2 rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
                {lastTwoMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "text-sm",
                      msg.source === "user"
                        ? "text-primary"
                        : "text-muted-foreground",
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
