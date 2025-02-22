"use client";

import { RecordButton } from "@/components/RecordButton";
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
import { activeToolAtom, type ToolType } from "@/lib/atoms";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { JournalEntry } from "@/types";
import { useConversation } from "@11labs/react";
import { useUser } from "@clerk/nextjs";
import { useAtom } from "jotai";
import { BookOpen, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
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

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>("chat");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const transcriptRef = useRef<ConversationTranscript>({
    messages: [],
  });
  const [transcript, setTranscript] = useState<ConversationTranscript>({
    messages: [],
  });
  const { user } = useUser();
  const { data: promptAttributes, isPending } =
    api.user.getPromptAttributes.useQuery();
  const [, setActiveTool] = useAtom<ToolType | null>(activeToolAtom);
  const name = user?.firstName;

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to ElevenLabs");
      toast.success("Ready to record");
    },
    onDisconnect: (props: unknown) => {
      console.log("Disconnected from ElevenLabs", props);
      toast.info("Recording stopped");

      void saveJournalEntry();
    },
    onMessage: async (message: Message) => {
      console.log("Received message:", message);
      setTranscript((prev) => ({
        ...prev,
        messages: [...prev.messages, message],
      }));

      transcriptRef.current.messages.push(message);
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

  const selectedMoodData = MOODS.find((mood) => mood.id === selectedMood);

  const getSystemPrompt = (mood: string) => {
    const basePrompt = `You are an empathetic and insightful journaling assistant designed to help users reflect on their day. Your role is to gently prompt users with open-ended questions that encourage self-exploration and emotional clarity. Ask questions like, 'What moment stood out to you today?' or 'How did you feel during that experience?' Maintain a supportive, non-judgmental tone, and allow the user's pace and mood to guide the conversation. Always encourage honesty and self-compassion, ensuring the user feels safe and understood. Respond in at most 2-3 sentences.`;

    const moodPrompts: Record<string, string> = {
      vent: "The user needs to vent. Be extra patient and understanding. Let them express their frustrations freely. Acknowledge their feelings and validate their experiences. Don't rush to offer solutions unless specifically asked. Start by creating a safe space for them to express their feelings.",
      chat: "Keep the conversation light and casual. Be friendly and engaging, but still maintain emotional awareness. Feel free to share brief, relevant observations while keeping the focus on the user. Guide the conversation naturally without being too formal.",
      unwind:
        "Help the user relax and decompress. Use a calming tone and gentle pacing. Guide them toward positive reflection while acknowledging any stress or tension they may be carrying. Focus on breathing and present-moment awareness if appropriate.",
    };

    const moodData = MOODS.find((m) => m.id === mood) ?? MOODS[0];

    const contextPrompt = [
      `- User's chosen mood: ${moodData?.label}`,
      `- Session purpose: ${moodData?.description}`,
      `- Initial approach: ${moodData?.prompt}`,

      `----`,
      promptAttributes?.memory &&
        promptAttributes.memory.length > 0 &&
        `Summary of previous journal entries: ${promptAttributes.memory
          .map((m, idx) => `- ${idx + 1}. ${m}`)
          .join("\n")}`,

      `----`,

      `Mood scores over the last 7 days: ${promptAttributes?.moodScoresWithDays
        .map((m) => `- ${m.day}: ${m.moodScore}`)
        .join("\n")}`,

      `----`,

      `Significant events over the last 7 days: ${promptAttributes?.significantEventsWithDays
        .map((e) => `- ${e.day}: ${e.significantEvents.join(", ")}`)
        .join("\n")}`,
    ].join("\n");

    const moodSpecificPrompt = moodPrompts[mood] ?? moodPrompts.unwind;

    return [`${basePrompt}`, `${moodSpecificPrompt}`, `${contextPrompt}`].join(
      "\n",
    );
  };

  const getFirstMessage = () => {
    return `Hi ${name}! How can I help you today?`;
  };

  const saveJournalEntry = async () => {
    try {
      console.log("Saving transcript:", transcriptRef.current);
      const rawEntry = transcriptRef.current.messages
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
      setIsRecording(false);
      setIsProcessing(true);
      await conversation.endSession();
      setTranscript({ messages: [] });
      transcriptRef.current.messages = [];
      setIsProcessing(false);
    } else {
      setIsRecording(true);
      if (!selectedMood) {
        toast.error("Please select how you're feeling first");
        return;
      }
      try {
        console.log("Starting recording with mood:", selectedMood);
        console.log("System prompt:", getSystemPrompt(selectedMood));
        await navigator.mediaDevices.getUserMedia({ audio: true });
        await conversation?.startSession({
          agentId: "AupMfEyUGwuMVyOywI6b",
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
    setIsRecording(false);
    setIsProcessing(false);
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
      <ToolDialog />
      <Card className="relative w-full overflow-hidden border-sage-200 bg-gradient-to-br from-sage-50 to-white shadow-none transition-all hover:border-sage-300 hover:shadow-lg">
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

          <div className="flex items-center justify-center gap-2">
            <RecordButton
              isRecording={isRecording}
              isProcessing={isProcessing}
              onMouseDown={toggleRecording}
              disabled={isProcessing || isPending}
            />

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
